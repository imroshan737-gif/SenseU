import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import NeonButton from "./NeonButton";

interface InterventionCardProps {
  title: string;
  description: string;
  duration: string;
  icon: LucideIcon;
  type: "micro" | "focus" | "recovery" | "social" | "emergency";
  onStart?: () => void;
  className?: string;
}

const InterventionCard = ({
  title,
  description,
  duration,
  icon: Icon,
  type,
  onStart,
  className,
}: InterventionCardProps) => {
  const typeStyles = {
    micro: {
      gradient: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-500/40",
      icon: "text-cyan-400",
      glow: "hover:shadow-[0_0_30px_hsl(180_100%_50%/0.3)]",
    },
    focus: {
      gradient: "from-violet-500/20 to-purple-500/10",
      border: "border-violet-500/40",
      icon: "text-violet-400",
      glow: "hover:shadow-[0_0_30px_hsl(263_70%_58%/0.3)]",
    },
    recovery: {
      gradient: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/40",
      icon: "text-emerald-400",
      glow: "hover:shadow-[0_0_30px_hsl(142_76%_50%/0.3)]",
    },
    social: {
      gradient: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/40",
      icon: "text-amber-400",
      glow: "hover:shadow-[0_0_30px_hsl(45_100%_50%/0.3)]",
    },
    emergency: {
      gradient: "from-red-500/20 to-rose-500/10",
      border: "border-red-500/40",
      icon: "text-red-400",
      glow: "hover:shadow-[0_0_30px_hsl(0_84%_60%/0.3)]",
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "bg-gradient-to-br border backdrop-blur-sm",
        "transition-all duration-500 hover:scale-[1.02]",
        "group cursor-pointer",
        style.gradient,
        style.border,
        style.glow,
        className
      )}
    >
      {/* Floating icon */}
      <div
        className={cn(
          "absolute -top-2 -right-2 w-20 h-20 rounded-full",
          "flex items-center justify-center",
          "bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity",
          style.gradient
        )}
      >
        <Icon className={cn("w-10 h-10", style.icon)} />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2.5 rounded-xl bg-gradient-to-br",
              style.gradient,
              "border",
              style.border
            )}
          >
            <Icon className={cn("w-5 h-5", style.icon)} />
          </div>
          <div>
            <h3 className="font-orbitron font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{duration}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <NeonButton
          onClick={onStart}
          variant={type === "emergency" ? "danger" : "primary"}
          size="sm"
          className="w-full"
        >
          {type === "emergency" ? "Activate SOS" : "Start Session"}
        </NeonButton>
      </div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, transparent, ${type === "emergency" ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 240, 255, 0.1)"}, transparent)`,
          }}
        />
      </div>
    </div>
  );
};

export default InterventionCard;
