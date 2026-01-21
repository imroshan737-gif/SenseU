import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Heart, Brain, Zap, Activity, Sparkles } from "lucide-react";

interface DigitalTwinProps {
  stressLevel?: number;
  className?: string;
}

const DigitalTwin = ({ stressLevel = 30, className }: DigitalTwinProps) => {
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const getAuraColor = () => {
    if (stressLevel <= 20) return "#00f0ff";
    if (stressLevel <= 40) return "#22c55e";
    if (stressLevel <= 60) return "#eab308";
    if (stressLevel <= 80) return "#f97316";
    return "#ef4444";
  };

  const getStatusText = () => {
    if (stressLevel <= 20) return "Optimal State";
    if (stressLevel <= 40) return "Balanced Mode";
    if (stressLevel <= 60) return "Elevated Attention";
    if (stressLevel <= 80) return "High Alert";
    return "Recovery Needed";
  };

  const getStatusEmoji = () => {
    if (stressLevel <= 20) return "✨";
    if (stressLevel <= 40) return "💚";
    if (stressLevel <= 60) return "⚡";
    if (stressLevel <= 80) return "🔥";
    return "🆘";
  };

  const auraColor = getAuraColor();

  // Pulse animation based on stress
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity(prev => prev === 1 ? 1.05 : 1);
    }, stressLevel <= 40 ? 2000 : stressLevel <= 60 ? 1500 : 1000);
    return () => clearInterval(interval);
  }, [stressLevel]);

  // Interactive zones data
  const zones = [
    { id: "brain", icon: Brain, label: "Mind", value: Math.max(0, 100 - stressLevel), position: "top-2 left-1/2 -translate-x-1/2" },
    { id: "heart", icon: Heart, label: "Heart", value: stressLevel <= 50 ? 85 : 65, position: "top-16 left-1/2 -translate-x-1/2" },
    { id: "energy", icon: Zap, label: "Energy", value: Math.max(30, 100 - stressLevel * 0.8), position: "bottom-12 left-4" },
    { id: "vitality", icon: Activity, label: "Vitality", value: stressLevel <= 40 ? 90 : 70, position: "bottom-12 right-4" },
  ];

  return (
    <div className={cn("relative flex flex-col items-center justify-center gap-4", className)}>
      {/* Main Avatar Container */}
      <div className="relative w-48 h-56 flex items-center justify-center">
        {/* Outer aura glow */}
        <div
          className="absolute w-48 h-56 rounded-full blur-3xl opacity-40 transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle, ${auraColor}60 0%, transparent 70%)`,
            transform: `scale(${pulseIntensity})`,
          }}
        />

        {/* Interactive zones */}
        {zones.map((zone) => {
          const Icon = zone.icon;
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              className={cn(
                "absolute p-2 rounded-full transition-all duration-300 z-20",
                "hover:scale-125 cursor-pointer group",
                isActive ? "scale-125" : ""
              )}
              style={{
                background: isActive ? `${auraColor}40` : `${auraColor}20`,
                boxShadow: isActive ? `0 0 20px ${auraColor}` : "none",
              }}
              onMouseEnter={() => setActiveZone(zone.id)}
              onMouseLeave={() => setActiveZone(null)}
            >
              <Icon 
                className="w-4 h-4 transition-colors" 
                style={{ color: auraColor }}
              />
              {/* Tooltip */}
              <div className={cn(
                "absolute left-1/2 -translate-x-1/2 -top-10 px-2 py-1 rounded-lg text-xs font-orbitron whitespace-nowrap",
                "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                "bg-background/90 border border-primary/30"
              )}>
                <span style={{ color: auraColor }}>{zone.label}: {zone.value}%</span>
              </div>
            </button>
          );
        })}

        {/* Human silhouette SVG */}
        <svg
          viewBox="0 0 100 180"
          className="w-32 h-48 relative z-10 transition-all duration-500"
          style={{
            filter: `drop-shadow(0 0 25px ${auraColor}90)`,
            transform: `scale(${pulseIntensity})`,
          }}
        >
          {/* Body outline with gradient */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={auraColor} stopOpacity="0.9" />
              <stop offset="50%" stopColor={auraColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={auraColor} stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="coreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor={auraColor} stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Head */}
          <circle
            cx="50"
            cy="22"
            r="18"
            fill="url(#bodyGradient)"
            stroke={auraColor}
            strokeWidth="1.5"
            filter="url(#glow)"
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

          {/* Heart core - animated */}
          <circle
            cx="50"
            cy="70"
            r="10"
            fill="url(#coreGradient)"
            filter="url(#glow)"
            className="animate-pulse"
          />

          {/* Energy flow lines */}
          <path
            d="M50 80 L50 105"
            stroke={auraColor}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-20"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Chakra points */}
          <circle cx="50" cy="22" r="3" fill={auraColor} opacity="0.6" className="animate-pulse" />
          <circle cx="50" cy="55" r="2" fill={auraColor} opacity="0.5" />
          <circle cx="50" cy="90" r="2" fill={auraColor} opacity="0.5" />
        </svg>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const radius = 75 + (i % 2) * 15;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-float"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                background: auraColor,
                boxShadow: `0 0 12px ${auraColor}`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.7,
              }}
            />
          );
        })}
      </div>

      {/* Status Section */}
      <div className="flex flex-col items-center gap-2">
        {/* Status badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-orbitron tracking-wider"
          style={{
            background: `linear-gradient(135deg, ${auraColor}20, ${auraColor}10)`,
            border: `1px solid ${auraColor}40`,
            color: auraColor,
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>{getStatusEmoji()} {getStatusText()}</span>
        </div>

        {/* Stress meter */}
        <div className="w-40 h-2 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${stressLevel}%`,
              background: `linear-gradient(90deg, #22c55e, ${auraColor})`,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Stress Level: <span style={{ color: auraColor }}>{stressLevel}%</span>
        </p>

        {/* Interactive hint */}
        <p className="text-xs text-muted-foreground/60 mt-1">
          Hover over zones to see details
        </p>
      </div>
    </div>
  );
};

export default DigitalTwin;
