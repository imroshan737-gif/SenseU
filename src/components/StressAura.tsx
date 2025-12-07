import { cn } from "@/lib/utils";

interface StressAuraProps {
  level: number; // 0-100
  size?: number;
  className?: string;
}

const StressAura = ({ level, size = 280, className }: StressAuraProps) => {
  const getStressColor = () => {
    if (level <= 20) return { main: "#00f0ff", name: "Calm" };
    if (level <= 40) return { main: "#22c55e", name: "Balanced" };
    if (level <= 60) return { main: "#eab308", name: "Rising" };
    if (level <= 80) return { main: "#f97316", name: "High" };
    return { main: "#ef4444", name: "Critical" };
  };

  const { main, name } = getStressColor();

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Outer rotating gradient ring */}
      <div
        className="absolute inset-0 rounded-full animate-rotate-aura"
        style={{
          background: `conic-gradient(from 0deg, ${main}00, ${main}80, ${main}00)`,
          filter: "blur(20px)",
        }}
      />

      {/* Middle pulsing ring */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: size * 0.85,
          height: size * 0.85,
          border: `2px solid ${main}50`,
          boxShadow: `0 0 30px ${main}40, inset 0 0 30px ${main}20`,
        }}
      />

      {/* Inner glow circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: `radial-gradient(circle, ${main}20 0%, transparent 70%)`,
        }}
      />

      {/* Center content area */}
      <div
        className="relative z-10 rounded-full bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          border: `1px solid ${main}30`,
        }}
      >
        <span
          className="text-4xl font-orbitron font-bold"
          style={{ color: main, textShadow: `0 0 20px ${main}80` }}
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
              background: isActive ? main : "#374151",
              boxShadow: isActive ? `0 0 10px ${main}` : "none",
            }}
          />
        );
      })}
    </div>
  );
};

export default StressAura;
