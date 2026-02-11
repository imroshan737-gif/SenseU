import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import NeonButton from "@/components/NeonButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const gad7Questions = [
  {
    id: "gad1",
    type: "mcq" as const,
    question: "Feeling nervous, anxious, or on edge?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "gad2",
    type: "mcq" as const,
    question: "Not being able to stop or control worrying?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "gad3",
    type: "mcq" as const,
    question: "Worrying too much about different things?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "gad4",
    type: "mcq" as const,
    question: "Trouble relaxing?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "gad5",
    type: "mcq" as const,
    question: "Being so restless that it is hard to sit still?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "gad6",
    type: "mcq" as const,
    question: "Becoming easily annoyed or irritable?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
  {
    id: "gad7",
    type: "mcq" as const,
    question: "Feeling afraid, as if something awful might happen?",
    options: [
      { label: "Not at all", value: "0" },
      { label: "Several days", value: "1" },
      { label: "More than half the days", value: "2" },
      { label: "Nearly every day", value: "3" },
    ],
  },
];

export default function Anxiety() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = gad7Questions[currentStep];
  const isLastQuestion = currentStep === gad7Questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      let totalScore = 0;
      Object.values(answers).forEach((val) => {
        totalScore += parseInt(val, 10);
      });
      toast.success(`Assessment Complete! Your Anxiety Score is: ${totalScore}`);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
       <div className="text-center mb-8">
        <h1 className="text-3xl font-orbitron font-bold text-gradient">GAD-7 Assessment</h1>
        <p className="text-muted-foreground">Anxiety Screening Scale</p>
      </div>

      <AssessmentProgress currentStep={currentStep + 1} totalSteps={gad7Questions.length} />
      
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