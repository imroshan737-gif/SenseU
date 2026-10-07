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
      bg: "bg-primary/5",
      border: "border-primary/20",
      text: "text-primary",
      glow: "",
    },
    violet: {
      bg: "bg-primary/5",
      border: "border-primary/20",
      text: "text-primary",
      glow: "",
    },
    green: {
      bg: "bg-stress-balanced/5",
      border: "border-stress-balanced/25",
      text: "text-stress-balanced",
      glow: "",
    },
    amber: {
      bg: "bg-stress-rising/5",
      border: "border-stress-rising/25",
      text: "text-stress-rising",
      glow: "",
    },
    red: {
      bg: "bg-destructive/5",
      border: "border-destructive/25",
      text: "text-destructive",
      glow: "",
    },
  };

  const colorStyle = colors[color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4",
        "bg-card border",
        "transition-colors duration-200 hover:border-primary/30",
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
            "p-2 rounded-lg",
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
              trend === "up" && "border-b-4 border-b-stress-balanced",
              trend === "down" && "border-t-4 border-t-destructive",
              trend === "stable" && "w-4 h-0.5 bg-stress-rising border-none"
            )}
          />
          <span className="text-xs text-muted-foreground capitalize">{trend}</span>
        </div>
      )}

    </div>
  );
};

export default VitalsTile;
