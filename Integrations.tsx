import { useState } from "react";
import { ArrowLeft, Activity, Brain, TrendingDown } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import PHQ9Assessment from "@/components/assessment/Depression";
import GAD7Assessment from "@/components/assessment/Anxiety";
import PSSAssessment from "@/components/assessment/Stress";
import ParticleBackground from "@/components/ParticleBackground";
import { useNavigate } from "react-router-dom";

type AssessmentType = "depression" | "anxiety" | "stress" | null;

export default function ClinicalAssessments() {
  const [selectedTest, setSelectedTest] = useState<AssessmentType>(null);
  const navigate = useNavigate();

  // If a test is selected, show ONLY that test component
  if (selectedTest === "depression") {
    return (
      <div className="min-h-screen p-4 pt-20">
        <ParticleBackground />
        <div className="max-w-3xl mx-auto">
          <NeonButton variant="ghost" onClick={() => setSelectedTest(null)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assessments
          </NeonButton>
          <PHQ9Assessment />
        </div>
      </div>
    );
  }

  if (selectedTest === "anxiety") {
    return (
      <div className="min-h-screen p-4 pt-20">
        <ParticleBackground />
        <div className="max-w-3xl mx-auto">
          <NeonButton variant="ghost" onClick={() => setSelectedTest(null)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assessments
          </NeonButton>
          <GAD7Assessment />
        </div>
      </div>
    );
  }

  if (selectedTest === "stress") {
    return (
      <div className="min-h-screen p-4 pt-20">
        <ParticleBackground />
        <div className="max-w-3xl mx-auto">
          <NeonButton variant="ghost" onClick={() => setSelectedTest(null)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assessments
          </NeonButton>
          <PSSAssessment />
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: Show the Menu with 3 Cards
  // DEFAULT VIEW: Show the Menu with 3 Cards
  return (
    <div className="min-h-screen relative overflow-hidden bg-background p-4 md:p-8 pt-20">
      <ParticleBackground />
      
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-orbitron font-bold text-gradient mb-2">
              Clinical Assessments
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Standardized psychological scales to help you understand your mental well-being.
              These results are private and for self-monitoring only.
            </p>
          </div>
          <NeonButton variant="ghost" onClick={() => navigate("/dashboard")}>
             Back to Dashboard
          </NeonButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Depression Card (Formerly PHQ-9) */}
          <GlassCard className="p-6 hover:scale-[1.02] transition-transform duration-300" glow>
            <div className="p-3 bg-primary/10 w-fit rounded-xl mb-4 border border-primary/30">
              <TrendingDown className="w-8 h-8 text-primary" />
            </div>
            {/* CHANGE 1: Updated Title */}
            <h3 className="text-2xl font-orbitron font-bold mb-2">Depression</h3>
            <p className="text-muted-foreground mb-6 h-12">
              (PHQ-9) Measures depression severity and symptoms.
            </p>
            <NeonButton className="w-full" onClick={() => setSelectedTest("depression")}>
              Start Assessment
            </NeonButton>
          </GlassCard>

          {/* Anxiety Card (Formerly GAD-7) */}
          <GlassCard className="p-6 hover:scale-[1.02] transition-transform duration-300" glow>
            <div className="p-3 bg-secondary/10 w-fit rounded-xl mb-4 border border-secondary/30">
              <Activity className="w-8 h-8 text-secondary" />
            </div>
            {/* CHANGE 2: Updated Title */}
            <h3 className="text-2xl font-orbitron font-bold mb-2">Anxiety</h3>
            <p className="text-muted-foreground mb-6 h-12">
              (GAD-7) Measures anxiety levels over the last 2 weeks.
            </p>
            <NeonButton className="w-full" onClick={() => setSelectedTest("anxiety")}>
              Start Assessment
            </NeonButton>
          </GlassCard>

          {/* Stress Card (Formerly PSS) */}
          <GlassCard className="p-6 hover:scale-[1.02] transition-transform duration-300" glow>
            <div className="p-3 bg-accent/10 w-fit rounded-xl mb-4 border border-accent/30">
              <Brain className="w-8 h-8 text-accent" />
            </div>
            {/* CHANGE 3: Updated Title */}
            <h3 className="text-2xl font-orbitron font-bold mb-2">Stress</h3>
            <p className="text-muted-foreground mb-6 h-12">
              (PSS) Measures how unpredictable and overloaded you feel.
            </p>
            <NeonButton className="w-full" onClick={() => setSelectedTest("stress")}>
              Start Assessment
            </NeonButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}