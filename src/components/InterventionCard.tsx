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
      surface: "bg-primary/5 border-primary/20",
      iconSurface: "bg-primary/10 border-primary/20",
      icon: "text-primary",
    },
    focus: {
      surface: "bg-primary/5 border-primary/20",
      iconSurface: "bg-primary/10 border-primary/20",
      icon: "text-primary",
    },
    recovery: {
      surface: "bg-primary/5 border-primary/20",
      iconSurface: "bg-primary/10 border-primary/20",
      icon: "text-primary",
    },
    social: {
      surface: "bg-primary/5 border-primary/20",
      iconSurface: "bg-primary/10 border-primary/20",
      icon: "text-primary",
    },
    emergency: {
      surface: "bg-destructive/5 border-destructive/30",
      iconSurface: "bg-destructive/10 border-destructive/30",
      icon: "text-red-400",
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-5 border",
        "transition-colors duration-200 hover:border-primary/40",
        "group cursor-pointer flex flex-col",
        style.surface,
        className
      )}
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2.5 rounded-lg border",
              style.iconSurface
            )}
          >
            <Icon className={cn("w-5 h-5", style.icon)} />
          </div>
          <div>
            <h3 className="font-orbitron font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{duration}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 py-3">
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

    </div>
  );
};

export default InterventionCard;
