import { cn } from "@/lib/utils";
import { StressResult, getMoodEmoji, getStressColor } from "@/lib/stressCalculator";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { AlertCircle, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

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
  
  // Calculate gauge rotation (-90 to 90 degrees based on 0-100 score)
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
          {/* Gauge background */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
              className="opacity-30"
            />
            {/* Gradient arc */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--stress-calm))" />
                <stop offset="25%" stopColor="hsl(var(--stress-balanced))" />
                <stop offset="50%" stopColor="hsl(var(--stress-rising))" />
                <stop offset="75%" stopColor="hsl(var(--stress-high))" />
                <stop offset="100%" stopColor="hsl(var(--stress-critical))" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Needle */}
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-16 bg-foreground origin-bottom transition-transform duration-1000 ease-out"
            style={{ 
              transform: `translateX(-50%) rotate(${gaugeRotation}deg)`,
              boxShadow: `0 0 10px ${getStressColor(stressScore)}`,
            }}
          >
            <div className="w-3 h-3 rounded-full bg-foreground -translate-x-1 -translate-y-1" />
          </div>

          {/* Center circle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary" />
        </div>

        {/* Score display */}
        <div>
          <div 
            className="text-5xl font-orbitron font-bold"
            style={{ color: getStressColor(stressScore) }}
          >
            {stressScore}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Stress Score</div>
        </div>

        {/* Mood */}
        <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl">
          <span className="text-3xl">{getMoodEmoji(mood)}</span>
          <div className="text-left">
            <div className="font-orbitron font-semibold">{getMoodLabel(mood)}</div>
            <div className="text-xs text-muted-foreground">
              Confidence: {Math.round(confidence * 100)}%
            </div>
          </div>
        </div>

        {/* Typing Speed Detection */}
        {typingWPM > 0 && (
          <div className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-xl border",
            "bg-muted/20 border-border/30"
          )}>
            <span className="text-xl">{typingSpeedInfo.emoji}</span>
            <span className={cn("font-orbitron text-sm font-medium", typingSpeedInfo.color)}>
              {typingSpeedInfo.label}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              ({Math.round(typingWPM)} WPM)
            </span>
          </div>
        )}

        {/* Explanations */}
        <div className="space-y-2">
          <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
            Key Observations
          </h3>
          <ul className="space-y-2">
            {explanations.map((explanation, index) => (
              <li 
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
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
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Recommended
            </span>
          </div>
          <div className="font-orbitron font-semibold mb-3">
            {recommendedIntervention.title}
          </div>
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
        <NeonButton 
          onClick={onContinue}
          variant="ghost"
          className="w-full"
        >
          Continue to Dashboard
        </NeonButton>
      </div>
    </GlassCard>
  );
}
