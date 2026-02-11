import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import NeonButton from "@/components/NeonButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const pssQuestions = [
  {
    id: "pss1",
    type: "mcq" as const,
    question: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss2",
    type: "mcq" as const,
    question: "In the last month, how often have you felt that you were unable to control the important things in your life?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss3",
    type: "mcq" as const,
    question: "In the last month, how often have you felt nervous and 'stressed'?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss4",
    type: "mcq" as const,
    question: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss5",
    type: "mcq" as const,
    question: "In the last month, how often have you felt that things were going your way?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss6",
    type: "mcq" as const,
    question: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss7",
    type: "mcq" as const,
    question: "In the last month, how often have you been able to control irritations in your life?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss8",
    type: "mcq" as const,
    question: "In the last month, how often have you felt that you were on top of things?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss9",
    type: "mcq" as const,
    question: "In the last month, how often have you been angered because of things that were outside of your control?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
  {
    id: "pss10",
    type: "mcq" as const,
    question: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    options: [
      { label: "Never", value: "0" },
      { label: "Almost Never", value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Fairly Often", value: "3" },
      { label: "Very Often", value: "4" },
    ],
  },
];

export default function Stress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = pssQuestions[currentStep];
  const isLastQuestion = currentStep === pssQuestions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      let totalScore = 0;
      // Reverse scoring logic for questions 4, 5, 7, and 8
      const reverseMap: Record<string, number> = { "0": 4, "1": 3, "2": 2, "3": 1, "4": 0 };
      const reverseIds = ["pss4", "pss5", "pss7", "pss8"];

      Object.entries(answers).forEach(([key, val]) => {
        const numericVal = parseInt(val, 10);
        if (reverseIds.includes(key)) {
          totalScore += reverseMap[val];
        } else {
          totalScore += numericVal;
        }
      });
      toast.success(`Assessment Complete! Your Stress Score is: ${totalScore}`);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-orbitron font-bold text-gradient">PSS Assessment</h1>
        <p className="text-muted-foreground">Perceived Stress Scale</p>
      </div>

      <AssessmentProgress currentStep={currentStep + 1} totalSteps={pssQuestions.length} />
      
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