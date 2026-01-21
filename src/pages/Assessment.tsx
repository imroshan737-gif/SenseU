import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "@/components/ParticleBackground";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import StressResultCard from "@/components/assessment/StressResultCard";
import PrivacyNotice from "@/components/assessment/PrivacyNotice";
import { useTypingMetrics } from "@/hooks/useTypingMetrics";
import { useChoiceLatency } from "@/hooks/useChoiceLatency";
import { analyzeSentiment } from "@/lib/sentimentAnalysis";
import { 
  calculateStressScore, 
  QuestionAnswer, 
  StressResult,
  AssessmentPayload 
} from "@/lib/stressCalculator";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface Question {
  id: string;
  type: "mcq" | "text" | "slider";
  question: string;
  options?: { label: string; value: string }[];
  placeholder?: string;
  helpText?: string;
}

const questions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    question: "How would you rate your sleep during the past week?",
    options: [
      { label: "Excellent", value: "Excellent" },
      { label: "Good", value: "Good" },
      { label: "Fair", value: "Fair" },
      { label: "Poor", value: "Poor" },
      { label: "Very poor", value: "Very poor" },
    ],
    helpText: "Quality sleep is crucial for stress management. We use this to understand your baseline energy levels.",
  },
  {
    id: "q2",
    type: "mcq",
    question: "How often did you feel overwhelmed in the past two weeks?",
    options: [
      { label: "Never", value: "Never" },
      { label: "Rarely", value: "Rarely" },
      { label: "Sometimes", value: "Sometimes" },
      { label: "Often", value: "Often" },
      { label: "Always", value: "Always" },
    ],
    helpText: "Feeling overwhelmed is a key stress indicator. This helps us calibrate intervention timing.",
  },
  {
    id: "q3",
    type: "mcq",
    question: "Which best describes your current workload?",
    options: [
      { label: "Light", value: "Light" },
      { label: "Manageable", value: "Manageable" },
      { label: "Busy", value: "Busy" },
      { label: "Overloaded", value: "Overloaded" },
      { label: "Unmanageable", value: "Unmanageable" },
    ],
    helpText: "Understanding your workload helps us suggest appropriate break frequencies.",
  },
  {
    id: "q4",
    type: "text",
    question: "Describe in 1-3 sentences what is worrying you most right now.",
    placeholder: "Take your time. Share what's on your mind...",
    helpText: "We analyze typing patterns (speed, pauses) to understand stress indicators. Your text is encrypted.",
  },
  {
    id: "q5",
    type: "mcq",
    question: "How connected do you feel to friends or classmates?",
    options: [
      { label: "Very connected", value: "Very connected" },
      { label: "Somewhat connected", value: "Somewhat" },
      { label: "Neutral", value: "Neutral" },
      { label: "Isolated", value: "Isolated" },
      { label: "Very isolated", value: "Very isolated" },
    ],
    helpText: "Social connection significantly impacts mental wellbeing and stress resilience.",
  },
  {
    id: "q6",
    type: "slider",
    question: "On a scale of 0-10, how stressed do you feel right now?",
    helpText: "Your self-assessment helps calibrate our AI predictions with your subjective experience.",
  },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<StressResult | null>(null);
  
  const typingMetrics = useTypingMetrics();
  const choiceLatency = useChoiceLatency();
  const [finalTypingWPM, setFinalTypingWPM] = useState(0);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestion?.id] !== undefined && answers[currentQuestion?.id] !== "";

  // Start tracking when question changes
  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.type === "mcq" || currentQuestion.type === "slider") {
        choiceLatency.startQuestion(currentQuestion.id);
      } else if (currentQuestion.type === "text") {
        typingMetrics.startTracking();
      }
    }
  }, [currentStep, currentQuestion]);

  const handleAnswerChange = useCallback((value: string | number) => {
    if (!currentQuestion) return;

    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

    // Record choice latency for MCQ/slider
    if (currentQuestion.type === "mcq" || currentQuestion.type === "slider") {
      choiceLatency.recordChoice(currentQuestion.id, String(value));
    }
  }, [currentQuestion, choiceLatency]);

  const handleNext = async () => {
    if (isLastQuestion) {
      await submitAssessment();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);

    try {
      // Calculate typing metrics for text question
      const textAnswer = answers["q4"] as string || "";
      const finalTypingMetrics = typingMetrics.calculateMetrics(textAnswer);
      const sentiment = analyzeSentiment(textAnswer);

      // Build question answers
      const questionAnswers: QuestionAnswer[] = questions.map(q => {
        const latencyData = choiceLatency.metrics.find(m => m.questionId === q.id);
        
        if (q.type === "text") {
          return {
            id: q.id,
            type: q.type,
            answer: answers[q.id] as string || "",
            latencyMs: finalTypingMetrics.totalTimeMs,
            chars: finalTypingMetrics.answerLength,
            timeMs: finalTypingMetrics.totalTimeMs,
            wpm: finalTypingMetrics.typingSpeedWPM,
            backspaces: finalTypingMetrics.backspaceCount,
            pauses: finalTypingMetrics.idlePausesCount,
            sentiment: sentiment.score,
            keystrokeVariance: finalTypingMetrics.keystrokeRhythmVariability,
          };
        }

        return {
          id: q.id,
          type: q.type,
          answer: answers[q.id] ?? "",
          latencyMs: latencyData?.latencyMs ?? 0,
        };
      });

      // Build payload
      const payload: AssessmentPayload = {
        userId: "current-user", // Would be actual user ID
        questions: questionAnswers,
        typingMetrics: {
          avgWpm: finalTypingMetrics.typingSpeedWPM,
          avgCps: finalTypingMetrics.typingSpeedCPS,
          backspaceTotal: finalTypingMetrics.backspaceCount,
          idleTotalMs: finalTypingMetrics.idlePauseTotalDuration,
        },
        deviceContext: {
          platform: "web",
          agent: navigator.userAgent.slice(0, 100),
          screen: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          localTime: new Date().toISOString(),
        },
      };

      // Calculate stress score locally (would be API call in production)
      const stressResult = calculateStressScore(payload);
      
      // Store typing WPM for display
      setFinalTypingWPM(finalTypingMetrics.typingSpeedWPM);
      
      // Store assessment completion
      localStorage.setItem("neuroaura_assessment_done", "true");
      localStorage.setItem("neuroaura_stress_score", String(stressResult.stressScore));
      localStorage.setItem("neuroaura_mood", stressResult.mood);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setResult(stressResult);
      toast.success("Assessment complete!", {
        description: `Your stress score: ${stressResult.stressScore}`,
      });

    } catch (error) {
      console.error("Assessment submission error:", error);
      toast.error("Failed to submit assessment", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartIntervention = () => {
    // Navigate to intervention (would open intervention modal/page)
    toast.info("Starting intervention...", {
      description: result?.recommendedIntervention.title,
    });
    // Go to dashboard
    navigate("/dashboard");
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handlePrivacyAccept = () => {
    setConsentGiven(true);
    setShowPrivacy(false);
  };

  const handlePrivacyDecline = () => {
    setConsentGiven(false);
    setShowPrivacy(false);
    toast.info("Limited mode enabled", {
      description: "Some stress indicators will not be measured.",
    });
  };

  // Privacy consent screen
  if (showPrivacy) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
        <ParticleBackground />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
        
        <div className="relative z-10 w-full max-w-md">
          <PrivacyNotice onAccept={handlePrivacyAccept} onDecline={handlePrivacyDecline} />
        </div>
      </div>
    );
  }

  // Results screen
  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
        <ParticleBackground />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
        
        <div className="relative z-10 w-full">
          <StressResultCard
            result={result}
            typingWPM={finalTypingWPM}
            onStartIntervention={handleStartIntervention}
            onContinue={handleContinue}
          />
        </div>
      </div>
    );
  }

  // Question flow
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <ParticleBackground />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress */}
        <div className="flex justify-center mb-8">
          <AssessmentProgress 
            currentStep={currentStep + 1} 
            totalSteps={questions.length} 
          />
        </div>

        {/* Question card */}
        <GlassCard className="animate-fade-up" glow>
          <div className="space-y-8">
            <AssessmentQuestion
              key={currentQuestion.id}
              id={currentQuestion.id}
              type={currentQuestion.type}
              question={currentQuestion.question}
              options={currentQuestion.options}
              placeholder={currentQuestion.placeholder}
              helpText={currentQuestion.helpText}
              value={answers[currentQuestion.id] ?? (currentQuestion.type === "slider" ? 5 : "")}
              onChange={handleAnswerChange}
              onKeyDown={currentQuestion.type === "text" && consentGiven ? typingMetrics.handleKeyDown : undefined}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <NeonButton
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </NeonButton>

              <NeonButton
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : isLastQuestion ? (
                  "Complete Assessment"
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </NeonButton>
            </div>
          </div>
        </GlassCard>

        {/* Skip option */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              localStorage.setItem("neuroaura_assessment_done", "true");
              navigate("/dashboard");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now (limited features)
          </button>
        </div>
      </div>
    </div>
  );
}
