import { cn } from "@/lib/utils";

interface AssessmentProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function AssessmentProgress({
  currentStep,
  totalSteps,
  className,
}: AssessmentProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Background circle */}
      <svg className="w-28 h-28 transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="hsl(var(--muted))"
          strokeWidth="6"
          fill="none"
          className="opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="url(#progressGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease-out",
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-orbitron font-bold text-gradient">
          {currentStep}
        </span>
        <span className="text-xs text-muted-foreground">of {totalSteps}</span>
      </div>

      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{
          background: `conic-gradient(from 0deg, hsl(var(--primary)) ${progress}%, transparent ${progress}%)`,
        }}
      />
    </div>
  );
}
