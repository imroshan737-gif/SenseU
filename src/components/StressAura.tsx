import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

type StressStyle = CSSProperties & { "--stress-color": string };

interface StressAuraProps {
  level: number; // 0-100
  size?: number;
  className?: string;
}

const StressAura = ({ level, size = 280, className }: StressAuraProps) => {
  const getStressColor = () => {
    if (level <= 20) return { color: "var(--stress-calm)", name: "Calm" };
    if (level <= 40) return { color: "var(--stress-balanced)", name: "Balanced" };
    if (level <= 60) return { color: "var(--stress-rising)", name: "Rising" };
    if (level <= 80) return { color: "var(--stress-high)", name: "High" };
    return { color: "var(--stress-critical)", name: "Critical" };
  };

  const { color, name } = getStressColor();

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Restrained status ring */}
      <div
        className="absolute inset-0 rounded-full border border-[hsl(var(--stress-color)/0.3)]"
        style={{ "--stress-color": color } as StressStyle}
      />

      {/* Middle pulsing ring */}
      <div
        className="absolute rounded-full border-2 border-[hsl(var(--stress-color)/0.55)]"
        style={{
          "--stress-color": color,
          width: size * 0.85,
          height: size * 0.85,
          boxShadow: "inset 0 0 20px hsl(var(--stress-color) / 0.08)",
        } as StressStyle}
      />

      {/* Inner glow circle */}
      <div
        className="absolute rounded-full bg-[hsl(var(--stress-color)/0.08)]"
        style={{
          "--stress-color": color,
          width: size * 0.7,
          height: size * 0.7,
        } as StressStyle}
      />

      {/* Center content area */}
      <div
        className="relative z-10 rounded-full bg-card flex flex-col items-center justify-center border border-[hsl(var(--stress-color)/0.35)]"
        style={{
          "--stress-color": color,
          width: size * 0.55,
          height: size * 0.55,
        } as StressStyle}
      >
        <span
          className="text-4xl font-orbitron font-bold text-[hsl(var(--stress-color))]"
          style={{ "--stress-color": color } as StressStyle}
        >
          {level}
        </span>
        <span className="text-xs font-orbitron uppercase tracking-widest text-muted-foreground mt-1">
          {name}
        </span>
      </div>

      {/* Decorative dots around the ring */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = Math.cos(angle) * (size * 0.42);
        const y = Math.sin(angle) * (size * 0.42);
        const isActive = (i / 12) * 100 <= level;

        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full transition-all duration-500"
            style={{
              left: `calc(50% + ${x}px - 4px)`,
              top: `calc(50% + ${y}px - 4px)`,
              background: isActive ? `hsl(${color})` : "hsl(var(--muted))",
              boxShadow: "none",
            }}
          />
        );
      })}
    </div>
  );
};

export default StressAura;
