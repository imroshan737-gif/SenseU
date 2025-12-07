import { cn } from "@/lib/utils";
import { Monitor, X } from "lucide-react";

interface DemoBadgeProps {
  onExit: () => void;
  className?: string;
}

export default function DemoBadge({ onExit, className }: DemoBadgeProps) {
  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-3 px-4 py-2",
        "bg-secondary/20 backdrop-blur-sm border border-secondary/50 rounded-full",
        "shadow-[0_0_20px_hsl(var(--secondary)/0.3)]",
        "animate-scale-in",
        className
      )}
    >
      <Monitor className="w-4 h-4 text-secondary" />
      <span className="text-sm font-orbitron text-secondary">Demo Mode</span>
      <button
        onClick={onExit}
        className="p-1 rounded-full hover:bg-secondary/20 transition-colors group"
        aria-label="Exit demo"
      >
        <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
      </button>
    </div>
  );
}
