import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface VitalsTileProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  color?: "cyan" | "violet" | "green" | "amber" | "red";
  className?: string;
}

const VitalsTile = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color = "cyan",
  className,
}: VitalsTileProps) => {
  const colors = {
    cyan: {
      bg: "from-cyan-500/10 to-cyan-500/5",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      glow: "shadow-[0_0_20px_hsl(180_100%_50%/0.2)]",
    },
    violet: {
      bg: "from-violet-500/10 to-violet-500/5",
      border: "border-violet-500/30",
      text: "text-violet-400",
      glow: "shadow-[0_0_20px_hsl(263_70%_58%/0.2)]",
    },
    green: {
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "shadow-[0_0_20px_hsl(142_76%_50%/0.2)]",
    },
    amber: {
      bg: "from-amber-500/10 to-amber-500/5",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "shadow-[0_0_20px_hsl(45_100%_50%/0.2)]",
    },
    red: {
      bg: "from-red-500/10 to-red-500/5",
      border: "border-red-500/30",
      text: "text-red-400",
      glow: "shadow-[0_0_20px_hsl(0_84%_60%/0.2)]",
    },
  };

  const colorStyle = colors[color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4",
        "bg-gradient-to-br border backdrop-blur-sm",
        "transition-all duration-300 hover:scale-105",
        "vitals-wave",
        colorStyle.bg,
        colorStyle.border,
        colorStyle.glow,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-2xl font-orbitron font-bold", colorStyle.text)}>
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "p-2 rounded-lg bg-gradient-to-br",
            colorStyle.bg,
            colorStyle.border,
            "border"
          )}
        >
          <Icon className={cn("w-5 h-5", colorStyle.text)} />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <div
            className={cn(
              "w-0 h-0 border-l-4 border-r-4 border-transparent",
              trend === "up" && "border-b-4 border-b-emerald-400",
              trend === "down" && "border-t-4 border-t-red-400",
              trend === "stable" && "w-4 h-0.5 bg-amber-400 border-none"
            )}
          />
          <span className="text-xs text-muted-foreground capitalize">{trend}</span>
        </div>
      )}

      {/* Animated wave overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
          style={{
            background: `linear-gradient(to top, ${color === "cyan" ? "#00f0ff" : color === "violet" ? "#8b5cf6" : color === "green" ? "#22c55e" : color === "amber" ? "#f59e0b" : "#ef4444"}10, transparent)`,
          }}
        />
      </div>
    </div>
  );
};

export default VitalsTile;
