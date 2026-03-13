import { cn } from "@/lib/utils";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { Sparkles, AlertTriangle, CheckCircle, AlertCircle, ArrowLeft, Activity } from "lucide-react";

interface ClinicalResultCardProps {
  testName: string;
  scaleName: string;
  score: number;
  maxScore: number;
  onBack: () => void;
  onRetake: () => void;
}

function getSeverity(testType: string, score: number) {
  if (testType === "depression") {
    if (score <= 4) return { level: "Minimal", color: "hsl(142, 71%, 45%)", emoji: "😌", tip: "Your responses suggest minimal signs of depression. Keep up your healthy habits!", bg: "from-green-500/20 to-emerald-500/10" };
    if (score <= 9) return { level: "Mild", color: "hsl(200, 80%, 55%)", emoji: "🙂", tip: "Mild symptoms detected. Consider self-care activities like exercise, socializing, and adequate sleep.", bg: "from-blue-500/20 to-cyan-500/10" };
    if (score <= 14) return { level: "Moderate", color: "hsl(45, 90%, 50%)", emoji: "😐", tip: "Moderate symptoms noted. It may be helpful to talk to a counselor or mental health professional.", bg: "from-yellow-500/20 to-amber-500/10" };
    if (score <= 19) return { level: "Moderately Severe", color: "hsl(25, 90%, 55%)", emoji: "😟", tip: "Your score suggests significant symptoms. We recommend consulting a mental health professional.", bg: "from-orange-500/20 to-red-500/10" };
    return { level: "Severe", color: "hsl(0, 80%, 55%)", emoji: "😰", tip: "Your responses indicate severe symptoms. Please reach out to a mental health professional or crisis helpline.", bg: "from-red-500/20 to-rose-500/10" };
  }
  if (testType === "anxiety") {
    if (score <= 4) return { level: "Minimal", color: "hsl(142, 71%, 45%)", emoji: "😌", tip: "Your anxiety levels appear minimal. Great job managing your mental wellness!", bg: "from-green-500/20 to-emerald-500/10" };
    if (score <= 9) return { level: "Mild", color: "hsl(200, 80%, 55%)", emoji: "🙂", tip: "Mild anxiety detected. Breathing exercises and mindfulness can help manage these feelings.", bg: "from-blue-500/20 to-cyan-500/10" };
    if (score <= 14) return { level: "Moderate", color: "hsl(45, 90%, 50%)", emoji: "😐", tip: "Moderate anxiety noted. Consider speaking with a professional for coping strategies.", bg: "from-yellow-500/20 to-amber-500/10" };
    return { level: "Severe", color: "hsl(0, 80%, 55%)", emoji: "😰", tip: "Your responses indicate significant anxiety. Please consider reaching out to a mental health professional.", bg: "from-red-500/20 to-rose-500/10" };
  }
  // Stress (PSS-10, max 40)
  if (score <= 13) return { level: "Low Stress", color: "hsl(142, 71%, 45%)", emoji: "😌", tip: "Your perceived stress is low. You're handling things well!", bg: "from-green-500/20 to-emerald-500/10" };
  if (score <= 26) return { level: "Moderate Stress", color: "hsl(45, 90%, 50%)", emoji: "😐", tip: "You're experiencing moderate stress. Consider incorporating relaxation techniques into your daily routine.", bg: "from-yellow-500/20 to-amber-500/10" };
  return { level: "High Stress", color: "hsl(0, 80%, 55%)", emoji: "😰", tip: "Your stress levels are high. We strongly recommend stress management strategies and professional support.", bg: "from-red-500/20 to-rose-500/10" };
}

function getTestType(testName: string): string {
  if (testName.toLowerCase().includes("phq") || testName.toLowerCase().includes("depression")) return "depression";
  if (testName.toLowerCase().includes("gad") || testName.toLowerCase().includes("anxiety")) return "anxiety";
  return "stress";
}

export default function ClinicalResultCard({ testName, scaleName, score, maxScore, onBack, onRetake }: ClinicalResultCardProps) {
  const testType = getTestType(testName);
  const severity = getSeverity(testType, score);
  const percentage = Math.round((score / maxScore) * 100);

  // Build gauge
  const gaugeRotation = -90 + (percentage / 100) * 180;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", severity.bg)} />

      <div className="relative z-10 w-full max-w-lg">
        <GlassCard className="text-center" glow>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-orbitron font-bold">{testName} Results</h2>
            </div>
            <p className="text-sm text-muted-foreground">{scaleName}</p>

            {/* Gauge */}
            <div className="relative w-48 h-28 mx-auto">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" className="opacity-30" />
                <defs>
                  <linearGradient id="clinicalGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
                    <stop offset="33%" stopColor="hsl(45, 90%, 50%)" />
                    <stop offset="66%" stopColor="hsl(25, 90%, 55%)" />
                    <stop offset="100%" stopColor="hsl(0, 80%, 55%)" />
                  </linearGradient>
                </defs>
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#clinicalGaugeGradient)" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div 
                className="absolute bottom-0 left-1/2 w-1 h-16 bg-foreground origin-bottom transition-transform duration-1000 ease-out"
                style={{ transform: `translateX(-50%) rotate(${gaugeRotation}deg)`, boxShadow: `0 0 10px ${severity.color}` }}
              >
                <div className="w-3 h-3 rounded-full bg-foreground -translate-x-1 -translate-y-1" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary" />
            </div>

            {/* Score */}
            <div>
              <div className="text-5xl font-orbitron font-bold" style={{ color: severity.color }}>
                {score}
              </div>
              <div className="text-sm text-muted-foreground mt-1">out of {maxScore}</div>
            </div>

            {/* Severity badge */}
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl">
              <span className="text-3xl">{severity.emoji}</span>
              <div className="text-left">
                <div className="font-orbitron font-semibold" style={{ color: severity.color }}>{severity.level}</div>
                <div className="text-xs text-muted-foreground">
                  {testType === "depression" ? "PHQ-9" : testType === "anxiety" ? "GAD-7" : "PSS-10"} Classification
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className={cn(
              "p-4 rounded-xl border text-left",
              percentage >= 60 ? "bg-destructive/10 border-destructive/30" : percentage >= 35 ? "bg-amber-500/10 border-amber-500/30" : "bg-primary/10 border-primary/30"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {percentage >= 60 ? (
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                ) : percentage >= 35 ? (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-primary" />
                )}
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-orbitron">Recommendation</span>
              </div>
              <p className="text-sm text-muted-foreground">{severity.tip}</p>
            </div>

            {/* Score breakdown bar */}
            <div className="space-y-2">
              <h4 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">Score Breakdown</h4>
              <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%`, backgroundColor: severity.color }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0 (Minimal)</span>
                <span>{maxScore} (Severe)</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-muted-foreground/60 italic">
              This screening tool is not a diagnosis. Please consult a qualified mental health professional for clinical evaluation.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <NeonButton onClick={onBack} variant="ghost" className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Assessments
              </NeonButton>
              <NeonButton onClick={onRetake} variant="primary" className="flex-1 gap-2">
                <Sparkles className="w-4 h-4" /> Retake Test
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
