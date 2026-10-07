import { cn } from "@/lib/utils";

interface AIGuardianOrbProps {
  stressLevel?: "calm" | "balanced" | "rising" | "high" | "critical";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const AIGuardianOrb = ({ stressLevel = "calm", size = "md", onClick }: AIGuardianOrbProps) => {
  const stressColors = {
    calm: "bg-stress-calm",
    balanced: "bg-stress-balanced",
    rising: "bg-stress-rising",
    high: "bg-stress-high",
    critical: "bg-stress-critical",
  };

  const sizes = {
    sm: "w-14 h-14",
    md: "w-18 h-18",
    lg: "w-14 h-14 sm:w-24 sm:h-24",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-full cursor-pointer border border-foreground/20 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        stressColors[stressLevel],
        sizes[size]
      )}
      aria-label="Open Aurora assistant"
    >
      {/* Face container */}
      <div className="absolute inset-0 flex items-center justify-center text-background">
        {/* Eyes */}
        <div className="flex items-center gap-2 sm:gap-3 -mt-1">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-current" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-current" />
        </div>
      </div>
      
      {/* Smile */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2">
        <svg 
          width="14" 
          height="7" 
          viewBox="0 0 16 8" 
          className="text-background"
        >
          <path 
            d="M2 2 Q8 8 14 2" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Label below */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap hidden sm:block">
        <span className="px-3 py-1 text-xs font-orbitron bg-card rounded-lg border border-border text-foreground">
          Aurora
        </span>
      </div>
    </button>
  );
};

export default AIGuardianOrb;
