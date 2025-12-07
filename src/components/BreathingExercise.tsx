import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { X, Play, Pause } from "lucide-react";

interface BreathingExerciseProps {
  duration: number; // in seconds
  onComplete: () => void;
  onClose: () => void;
}

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const phaseConfig = {
  inhale: { duration: 4, label: "Breathe In", scale: 1.3 },
  hold: { duration: 4, label: "Hold", scale: 1.3 },
  exhale: { duration: 6, label: "Breathe Out", scale: 1 },
  rest: { duration: 2, label: "Rest", scale: 1 },
};

const phaseOrder: BreathPhase[] = ["inhale", "hold", "exhale", "rest"];

export default function BreathingExercise({
  duration,
  onComplete,
  onClose,
}: BreathingExerciseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const currentConfig = phaseConfig[phase];
  const totalProgress = (totalElapsed / duration) * 100;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPhaseProgress(prev => {
        const next = prev + (100 / (currentConfig.duration * 10));
        
        if (next >= 100) {
          // Move to next phase
          const currentIndex = phaseOrder.indexOf(phase);
          const nextIndex = (currentIndex + 1) % phaseOrder.length;
          setPhase(phaseOrder[nextIndex]);
          
          if (nextIndex === 0) {
            setCycleCount(c => c + 1);
          }
          
          return 0;
        }
        return next;
      });

      setTotalElapsed(prev => {
        const next = prev + 0.1;
        if (next >= duration) {
          setIsPlaying(false);
          onComplete();
          return duration;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, phase, currentConfig.duration, duration, onComplete]);

  const togglePlay = () => {
    if (totalElapsed >= duration) {
      // Reset
      setTotalElapsed(0);
      setPhase("inhale");
      setPhaseProgress(0);
      setCycleCount(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <GlassCard className="w-full max-w-md mx-4 relative" glow>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/30 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="space-y-8 py-4">
          <div className="text-center">
            <h2 className="text-xl font-orbitron font-bold mb-2">Breathing Exercise</h2>
            <p className="text-sm text-muted-foreground">
              Follow the circle. {duration} seconds.
            </p>
          </div>

          {/* Breathing visualization */}
          <div className="relative w-48 h-48 mx-auto">
            {/* Outer ring progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="90"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                fill="none"
                className="opacity-30"
              />
              <circle
                cx="96"
                cy="96"
                r="90"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - totalProgress / 100)}
                className="transition-all duration-100"
              />
            </svg>

            {/* Breathing circle */}
            <div
              className={cn(
                "absolute inset-8 rounded-full",
                "bg-gradient-to-br from-primary/30 to-secondary/30",
                "border border-primary/50",
                "flex items-center justify-center",
                "transition-transform duration-1000 ease-in-out",
                isPlaying && "animate-pulse"
              )}
              style={{
                transform: `scale(${isPlaying ? currentConfig.scale : 1})`,
              }}
            >
              {/* Inner glow */}
              <div 
                className={cn(
                  "absolute inset-4 rounded-full",
                  "bg-gradient-radial from-primary/40 to-transparent",
                  "transition-opacity duration-500"
                )}
                style={{ opacity: isPlaying ? 1 : 0.5 }}
              />
              
              {/* Phase label */}
              <span className="relative z-10 text-lg font-orbitron font-semibold text-primary">
                {currentConfig.label}
              </span>
            </div>

            {/* Phase progress ring */}
            {isPlaying && (
              <svg className="absolute inset-4 w-40 h-40 -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - phaseProgress / 100)}
                  className="transition-all duration-100"
                  style={{ opacity: 0.5 }}
                />
              </svg>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-center">
            <div>
              <div className="text-2xl font-orbitron font-bold text-primary">
                {Math.floor(totalElapsed)}s
              </div>
              <div className="text-xs text-muted-foreground">Elapsed</div>
            </div>
            <div>
              <div className="text-2xl font-orbitron font-bold text-secondary">
                {cycleCount}
              </div>
              <div className="text-xs text-muted-foreground">Cycles</div>
            </div>
            <div>
              <div className="text-2xl font-orbitron font-bold text-foreground">
                {Math.max(0, Math.ceil(duration - totalElapsed))}s
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <NeonButton onClick={togglePlay} size="lg" className="gap-2">
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : totalElapsed >= duration ? (
                <>
                  <Play className="w-5 h-5" />
                  Restart
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {totalElapsed > 0 ? "Resume" : "Start"}
                </>
              )}
            </NeonButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
