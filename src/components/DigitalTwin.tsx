import { cn } from "@/lib/utils";

interface DigitalTwinProps {
  stressLevel?: number;
  className?: string;
}

const DigitalTwin = ({ stressLevel = 30, className }: DigitalTwinProps) => {
  const getAuraColor = () => {
    if (stressLevel <= 20) return "#00f0ff";
    if (stressLevel <= 40) return "#22c55e";
    if (stressLevel <= 60) return "#eab308";
    if (stressLevel <= 80) return "#f97316";
    return "#ef4444";
  };

  const auraColor = getAuraColor();

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer aura glow */}
      <div
        className="absolute w-48 h-64 rounded-full blur-3xl opacity-30 animate-breathe"
        style={{ background: auraColor }}
      />

      {/* Human silhouette SVG */}
      <svg
        viewBox="0 0 100 180"
        className="w-32 h-48 relative z-10"
        style={{
          filter: `drop-shadow(0 0 20px ${auraColor}80)`,
        }}
      >
        {/* Body outline with gradient */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={auraColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={auraColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={auraColor} stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="coreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor={auraColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Head */}
        <circle
          cx="50"
          cy="22"
          r="18"
          fill="url(#bodyGradient)"
          stroke={auraColor}
          strokeWidth="1"
          className="animate-glow-pulse"
        />

        {/* Neck */}
        <path
          d="M44 38 L44 48 L56 48 L56 38"
          fill="url(#bodyGradient)"
          stroke={auraColor}
          strokeWidth="1"
        />

        {/* Torso */}
        <path
          d="M30 48 L70 48 L75 120 L25 120 Z"
          fill="url(#bodyGradient)"
          stroke={auraColor}
          strokeWidth="1"
        />

        {/* Left arm */}
        <path
          d="M30 48 L15 52 L10 95 L18 96 L25 60 L30 55"
          fill="url(#bodyGradient)"
          stroke={auraColor}
          strokeWidth="1"
        />

        {/* Right arm */}
        <path
          d="M70 48 L85 52 L90 95 L82 96 L75 60 L70 55"
          fill="url(#bodyGradient)"
          stroke={auraColor}
          strokeWidth="1"
        />

        {/* Left leg */}
        <path
          d="M35 120 L30 175 L40 176 L45 125"
          fill="url(#bodyGradient)"
          stroke={auraColor}
          strokeWidth="1"
        />

        {/* Right leg */}
        <path
          d="M65 120 L70 175 L60 176 L55 125"
          fill="url(#bodyGradient)"
          stroke={auraColor}
          strokeWidth="1"
        />

        {/* Heart core */}
        <circle
          cx="50"
          cy="70"
          r="8"
          fill="url(#coreGradient)"
          className="animate-pulse"
        />

        {/* Energy lines */}
        <path
          d="M50 78 L50 100"
          stroke={auraColor}
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <path
          d="M42 70 L25 70"
          stroke={auraColor}
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.5"
        />
        <path
          d="M58 70 L75 70"
          stroke={auraColor}
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.5"
        />
      </svg>

      {/* Particle effects around the body */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const radius = 80;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-float"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              background: auraColor,
              boxShadow: `0 0 10px ${auraColor}`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        );
      })}

      {/* Status label */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-orbitron uppercase tracking-widest"
        style={{
          background: `${auraColor}20`,
          border: `1px solid ${auraColor}50`,
          color: auraColor,
        }}
      >
        Digital Twin Active
      </div>
    </div>
  );
};

export default DigitalTwin;
