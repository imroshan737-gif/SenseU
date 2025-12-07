import { cn } from "@/lib/utils";

interface TimelinePoint {
  time: string;
  value: number;
  event?: string;
}

interface EmotionalTimelineProps {
  data: TimelinePoint[];
  className?: string;
}

const EmotionalTimeline = ({ data, className }: EmotionalTimelineProps) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const getColor = (value: number) => {
    if (value <= 20) return "#00f0ff";
    if (value <= 40) return "#22c55e";
    if (value <= 60) return "#eab308";
    if (value <= 80) return "#f97316";
    return "#ef4444";
  };

  const generatePath = () => {
    const width = 100 / (data.length - 1);
    let path = "";

    data.forEach((point, i) => {
      const x = i * width;
      const y = 100 - ((point.value - minValue) / range) * 80 - 10;

      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevX = (i - 1) * width;
        const prevY = 100 - ((data[i - 1].value - minValue) / range) * 80 - 10;
        const cpX1 = prevX + width / 3;
        const cpX2 = x - width / 3;
        path += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
      }
    });

    return path;
  };

  const path = generatePath();

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
          Emotional Timeline
        </h4>
        <span className="text-xs text-muted-foreground">Today</span>
      </div>

      <div className="relative h-32 bg-muted/20 rounded-xl overflow-hidden border border-border/30">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((y) => (
            <div
              key={y}
              className="absolute w-full h-px bg-border/20"
              style={{ top: `${y}%` }}
            />
          ))}
        </div>

        {/* SVG Wave */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Gradient fill under the line */}
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path
            d={`${path} L 100 100 L 0 100 Z`}
            fill="url(#waveGradient)"
          />

          {/* Main line */}
          <path
            d={path}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
          />

          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {data.map((point, i) => (
                <stop
                  key={i}
                  offset={`${(i / (data.length - 1)) * 100}%`}
                  stopColor={getColor(point.value)}
                />
              ))}
            </linearGradient>
          </defs>
        </svg>

        {/* Data points */}
        {data.map((point, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((point.value - minValue) / range) * 80 - 10;
          const color = getColor(point.value);

          return (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                background: color,
                boxShadow: `0 0 10px ${color}`,
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-card/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50 whitespace-nowrap">
                  <p className="text-xs font-orbitron text-foreground">{point.time}</p>
                  <p className="text-xs text-muted-foreground">Stress: {point.value}</p>
                  {point.event && (
                    <p className="text-xs text-primary mt-1">{point.event}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((point, i) => (
            <span key={i} className="text-[10px] text-muted-foreground/60">
              {point.time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalTimeline;
