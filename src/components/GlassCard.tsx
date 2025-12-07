import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  animate?: boolean;
  style?: CSSProperties;
}

const GlassCard = ({ children, className, glow = true, animate = false, style }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass-card p-6 transition-all duration-500",
        glow && "glow-border",
        animate && "animate-fade-up",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
