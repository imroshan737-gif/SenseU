import { useState } from "react";
import { cn } from "@/lib/utils";

interface AIGuardianOrbProps {
  stressLevel?: "calm" | "balanced" | "rising" | "high" | "critical";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const AIGuardianOrb = ({ stressLevel = "calm", size = "md", onClick }: AIGuardianOrbProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const stressColors = {
    calm: "from-cyan-400 via-cyan-500 to-blue-600",
    balanced: "from-emerald-400 via-green-500 to-teal-600",
    rising: "from-yellow-400 via-amber-500 to-orange-500",
    high: "from-orange-400 via-orange-500 to-red-500",
    critical: "from-red-400 via-red-500 to-rose-600",
  };

  const stressGlows = {
    calm: "shadow-[0_0_30px_hsl(180_100%_50%/0.5),0_0_60px_hsl(180_100%_50%/0.3)]",
    balanced: "shadow-[0_0_30px_hsl(142_76%_50%/0.5),0_0_60px_hsl(142_76%_50%/0.3)]",
    rising: "shadow-[0_0_30px_hsl(45_100%_50%/0.5),0_0_60px_hsl(45_100%_50%/0.3)]",
    high: "shadow-[0_0_30px_hsl(25_100%_55%/0.5),0_0_60px_hsl(25_100%_55%/0.3)]",
    critical: "shadow-[0_0_30px_hsl(0_84%_60%/0.5),0_0_60px_hsl(0_84%_60%/0.3)]",
  };

  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-full cursor-pointer transition-all duration-500",
        "bg-gradient-to-br",
        stressColors[stressLevel],
        stressGlows[stressLevel],
        sizes[size],
        isHovered && "scale-110",
        "animate-breathe"
      )}
    >
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-white/20 blur-sm" />
      
      {/* Core */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
      
      {/* Pulse rings */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 animate-ping",
          stressLevel === "calm" && "border-cyan-400/30",
          stressLevel === "balanced" && "border-green-400/30",
          stressLevel === "rising" && "border-yellow-400/30",
          stressLevel === "high" && "border-orange-400/30",
          stressLevel === "critical" && "border-red-400/30"
        )}
        style={{ animationDuration: "2s" }}
      />
      
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="px-3 py-1 text-xs font-orbitron bg-card/90 rounded-lg border border-primary/30 text-primary">
            AI Guardian
          </span>
        </div>
      )}
    </button>
  );
};

export default AIGuardianOrb;
