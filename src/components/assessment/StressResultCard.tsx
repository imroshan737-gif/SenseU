import { useState } from "react";
import { cn } from "@/lib/utils";
import { StressResult, getMoodEmoji, getStressColor } from "@/lib/stressCalculator";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { AlertCircle, HelpCircle, Sparkles, TrendingDown, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

interface StressResultCardProps {
  result: StressResult;
  typingWPM?: number;
  onStartIntervention: () => void;
  onContinue: () => void;
  className?: string;
}

const getTypingSpeedLabel = (wpm: number) => {
  if (wpm < 25) return { label: "Slow typing detected", color: "text-amber-500", emoji: "🐢" };
  if (wpm < 50) return { label: "Normal typing speed", color: "text-green-500", emoji: "✍️" };
  return { label: "Fast typing detected", color: "text-cyan-500", emoji: "⚡" };
};

export default function StressResultCard({
  result,
  typingWPM = 0,
  onStartIntervention,
  onContinue,
  className,
}: StressResultCardProps) {
  const { stressScore, mood, confidence, explanations, recommendedIntervention } = result;
  const typingSpeedInfo = getTypingSpeedLabel(typingWPM);
  const [showCalcDetails, setShowCalcDetails] = useState(false);
  
  const gaugeRotation = -90 + (stressScore / 100) * 180;

  const getMoodLabel = (mood: string) => {
    const labels: Record<string, string> = {
      calm: "Calm & Relaxed",
      neutral: "Balanced",
      anxious: "Mildly Anxious",
      fatigued: "Fatigued",
      overwhelmed: "Overwhelmed",
      motivated: "Motivated",
    };
    return labels[mood] || mood;
  };

  return (
    <GlassCard className={cn("max-w-lg mx-auto text-center", className)} glow>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-orbitron font-bold">Your Baseline Assessment</h2>
        </div>

        {/* Gauge */}
        <div className="relative w-48 h-28 mx-auto">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" className="opacity-30" />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--stress-calm))" />
                <stop offset="25%" stopColor="hsl(var(--stress-balanced))" />
                <stop offset="50%" stopColor="hsl(var(--stress-rising))" />
                <stop offset="75%" stopColor="hsl(var(--stress-high))" />
                <stop offset="100%" stopColor="hsl(var(--stress-critical))" />
              </linearGradient>
            </defs>
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round" />
          </svg>
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-16 bg-foreground origin-bottom transition-transform duration-1000 ease-out"
            style={{ transform: `translateX(-50%) rotate(${gaugeRotation}deg)`, boxShadow: `0 0 10px ${getStressColor(stressScore)}` }}
          >
            <div className="w-3 h-3 rounded-full bg-foreground -translate-x-1 -translate-y-1" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary" />
        </div>

        {/* Score display */}
        <div>
          <div className="text-5xl font-orbitron font-bold" style={{ color: getStressColor(stressScore) }}>
            {stressScore}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Stress Score</div>
        </div>

        {/* Mood */}
        <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl">
          <span className="text-3xl">{getMoodEmoji(mood)}</span>
          <div className="text-left">
            <div className="font-orbitron font-semibold">{getMoodLabel(mood)}</div>
            <div className="text-xs text-muted-foreground">Confidence: {Math.round(confidence * 100)}%</div>
          </div>
        </div>

        {/* Typing Speed Detection */}
        {typingWPM > 0 && (
          <div className={cn("flex items-center justify-center gap-2 p-3 rounded-xl border", "bg-muted/20 border-border/30")}>
            <span className="text-xl">{typingSpeedInfo.emoji}</span>
            <span className={cn("font-orbitron text-sm font-medium", typingSpeedInfo.color)}>{typingSpeedInfo.label}</span>
            <span className="text-xs text-muted-foreground ml-1">({Math.round(typingWPM)} WPM)</span>
          </div>
        )}

        {/* Explanations */}
        <div className="space-y-2">
          <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">Key Observations</h3>
          <ul className="space-y-2">
            {explanations.map((explanation, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                {stressScore >= 45 ? (
                  <TrendingUp className="w-4 h-4 text-stress-rising shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-stress-calm shrink-0" />
                )}
                {explanation}
              </li>
            ))}
          </ul>
        </div>

        {/* How it's calculated */}
        <div className="border border-border/30 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowCalcDetails(!showCalcDetails)}
            className="w-full flex items-center justify-center gap-2 p-3 hover:bg-muted/20 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-orbitron font-medium text-primary">How it's calculated</span>
            {showCalcDetails ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
          </button>
          
          {showCalcDetails && (
            <div className="px-4 pb-4 space-y-4 text-left border-t border-border/30 pt-4 animate-fade-up">
              <p className="text-xs text-muted-foreground">
                Your stress score is calculated using a <strong className="text-foreground">weighted formula</strong> that combines multiple signals from your assessment:
              </p>

              {/* Weight breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">Signal Weights</h4>
                {[
                  { label: "Sleep Quality (Q1)", weight: "15%", desc: "Mapped from Excellent (0) to Very Poor (1). Poor sleep strongly correlates with high stress.", icon: "🛌" },
                  { label: "Overwhelm Frequency (Q2)", weight: "15%", desc: "Mapped from Never (0) to Always (1). Feeling overwhelmed is a key stress indicator.", icon: "😵" },
                  { label: "Workload Level (Q3)", weight: "15%", desc: "Mapped from Light (0) to Unmanageable (1). Higher workload increases stress score.", icon: "📋" },
                  { label: "Social Connection (Q5)", weight: "10%", desc: "Mapped from Very Connected (0) to Very Isolated (1). Isolation amplifies stress.", icon: "🤝" },
                  { label: "Typing Speed (Q4)", weight: "12%", desc: `Compared to 40 WPM baseline. Slower typing = higher stress signal. Your speed: ${Math.round(typingWPM)} WPM.`, icon: "⌨️" },
                  { label: "Backspace/Corrections (Q4)", weight: "10%", desc: "Ratio of backspaces to total characters. High correction rate suggests hesitation or anxiety.", icon: "⌫" },
                  { label: "Idle Pauses (Q4)", weight: "8%", desc: "Total pause time during typing (>2s gaps). Extended pauses may indicate distraction or rumination.", icon: "⏸️" },
                  { label: "Sentiment Analysis (Q4)", weight: "8%", desc: "AI-analyzed emotional tone of your written response. Negative sentiment increases the score.", icon: "💬" },
                  { label: "Choice Latency (MCQs)", weight: "7%", desc: "Average time to answer MCQ questions. Longer deliberation may indicate uncertainty or stress.", icon: "⏱️" },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-muted/20 rounded-lg border border-border/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <span>{item.icon}</span> {item.label}
                      </span>
                      <span className="text-xs font-orbitron font-bold text-primary">{item.weight}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Self-report blend */}
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <span>🎚️</span>
                  <span className="text-xs font-medium text-foreground">Self-Reported Stress (Q6)</span>
                  <span className="text-xs font-orbitron font-bold text-primary ml-auto">30% blend</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your slider value (0–10) is blended with the calculated score: <strong className="text-foreground">Final = 70% × Calculated + 30% × Self-Report</strong>. This ensures your subjective experience is always respected.
                </p>
              </div>

              {/* Mood mapping */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">Mood Classification</h4>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {[
                    { range: "0–24", mood: "😌 Calm", color: "text-green-400" },
                    { range: "25–44", mood: "😐 Neutral", color: "text-blue-400" },
                    { range: "45–64", mood: "😰 Anxious", color: "text-yellow-400" },
                    { range: "65–79", mood: "😫 Fatigued", color: "text-orange-400" },
                    { range: "80–100", mood: "🥵 Overwhelmed", color: "text-red-400" },
                    { range: "<30 + good sleep", mood: "💪 Motivated", color: "text-emerald-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-1.5 bg-muted/10 rounded">
                      <span className={cn("font-orbitron font-bold", item.color)}>{item.range}</span>
                      <span className="text-muted-foreground">→ {item.mood}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence */}
              <div className="p-3 bg-muted/20 rounded-lg border border-border/20">
                <h4 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground mb-1">Confidence Score ({Math.round(confidence * 100)}%)</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Confidence = <strong className="text-foreground">60% × Signal Coverage</strong> (how many behavioral signals were captured) + <strong className="text-foreground">40% × Answer Consistency</strong> (how consistent your response times were across questions). Missing signals or erratic timing reduces confidence.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recommended intervention */}
        <div className={cn(
          "p-4 rounded-xl border",
          recommendedIntervention.priority === "high" 
            ? "bg-destructive/10 border-destructive/30"
            : recommendedIntervention.priority === "medium"
            ? "bg-stress-rising/10 border-stress-rising/30"
            : "bg-primary/10 border-primary/30"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className={cn(
              "w-4 h-4",
              recommendedIntervention.priority === "high" 
                ? "text-destructive"
                : recommendedIntervention.priority === "medium"
                ? "text-stress-rising"
                : "text-primary"
            )} />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Recommended</span>
          </div>
          <div className="font-orbitron font-semibold mb-3">{recommendedIntervention.title}</div>
          <NeonButton 
            onClick={onStartIntervention}
            variant={recommendedIntervention.priority === "high" ? "danger" : "primary"}
            size="sm"
            className="w-full"
          >
            Start Now
          </NeonButton>
        </div>

        {/* Continue button */}
        <NeonButton onClick={onContinue} variant="ghost" className="w-full">
          Continue to Dashboard
        </NeonButton>
      </div>
    </GlassCard>
  );
}
