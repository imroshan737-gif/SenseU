import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import NeonButton from "@/components/NeonButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const phq9Questions = [
  {
    id: "phq1",
    type: "mcq" as const,
    question: "Little interest or pleasure in doing things?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq2",
    type: "mcq" as const,
    question: "Feeling down, depressed, or hopeless?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq3",
    type: "mcq" as const,
    question: "Trouble falling or staying asleep, or sleeping too much?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq4",
    type: "mcq" as const,
    question: "Feeling tired or having little energy?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq5",
    type: "mcq" as const,
    question: "Poor appetite or overeating?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq6",
    type: "mcq" as const,
    question: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq7",
    type: "mcq" as const,
    question: "Trouble concentrating on things, such as reading the newspaper or watching television?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq8",
    type: "mcq" as const,
    question: "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "phq9",
    type: "mcq" as const,
    question: "Thoughts that you would be better off dead, or of hurting yourself in some way?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
];

export default function Depression() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = phq9Questions[currentStep];
  const isLastQuestion = currentStep === phq9Questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate Score
      let totalScore = 0;
      Object.values(answers).forEach((val) => {
        totalScore += parseInt(val, 10);
      });
      toast.success(`Assessment Complete! Your Depression Score is: ${totalScore}`);
      // Here you would normally redirect or save to database
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-orbitron font-bold text-gradient">PHQ-9 Assessment</h1>
        <p className="text-muted-foreground">Depression Screening Scale</p>
      </div>

      <AssessmentProgress currentStep={currentStep + 1} totalSteps={phq9Questions.length} />
      
      <GlassCard glow className="p-6">
        <AssessmentQuestion
          {...currentQuestion}
          value={answers[currentQuestion.id] || ""}
          onChange={(val) => setAnswers({ ...answers, [currentQuestion.id]: String(val) })}
        />
        
        <div className="flex justify-between mt-8 pt-6 border-t border-border/30">
          <NeonButton 
            variant="ghost" 
            onClick={() => setCurrentStep(s => s - 1)} 
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </NeonButton>
          
          <NeonButton 
            onClick={handleNext} 
            disabled={!answers[currentQuestion.id]}
            className="gap-2"
          >
            {isLastQuestion ? "Finish" : "Next"} <ArrowRight className="w-4 h-4" />
          </NeonButton>
        </div>
      </GlassCard>
    </div>
  );
}