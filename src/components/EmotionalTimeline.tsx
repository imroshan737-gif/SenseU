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

const getStressColor = (value: number) => {
  if (value <= 20) return "hsl(var(--stress-calm))";
  if (value <= 40) return "hsl(var(--stress-balanced))";
  if (value <= 60) return "hsl(var(--stress-rising))";
  if (value <= 80) return "hsl(var(--stress-high))";
  return "hsl(var(--stress-critical))";
};

const EmotionalTimeline = ({ data, className }: EmotionalTimelineProps) => {
  const maxValue = Math.max(...data.map((point) => point.value));
  const minValue = Math.min(...data.map((point) => point.value));
  const range = maxValue - minValue || 1;
  const xStep = data.length > 1 ? 100 / (data.length - 1) : 0;
  const getY = (value: number) => 90 - ((value - minValue) / range) * 76;
  const path = data.map((point, index) => `${index === 0 ? "M" : "L"} ${index * xStep} ${getY(point.value)}`).join(" ");
  const area = data.length ? `${path} L 100 100 L 0 100 Z` : "";

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-orbitron uppercase tracking-wide text-muted-foreground">Emotional Timeline</h4>
        <span className="text-xs text-muted-foreground">Today</span>
      </div>

      <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-card">
        <div className="absolute inset-0" aria-hidden="true">
          {[25, 50, 75].map((y) => <div key={y} className="absolute w-full border-t border-border/50" style={{ top: `${y}%` }} />)}
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="timelineArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {area && <path d={area} fill="url(#timelineArea)" />}
          {path && <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
        </svg>

        {data.map((point, index) => (
          <div
            key={`${point.time}-${index}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${index * xStep}%`, top: `${getY(point.value)}%` }}
          >
            <div className="h-2.5 w-2.5 rounded-full border-2 border-card" style={{ background: getStressColor(point.value) }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg whitespace-nowrap">
                <p className="text-xs font-semibold text-foreground">{point.time}</p>
                <p className="mt-1 text-xs text-muted-foreground">Stress: {point.value}</p>
                {point.event && <p className="mt-1 text-xs text-primary">{point.event}</p>}
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 pb-2">
          {data.filter((_, index) => index % Math.ceil(data.length / 6 || 1) === 0).map((point, index) => (
            <span key={`${point.time}-${index}`} className="text-[10px] text-muted-foreground/70">{point.time}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalTimeline;
