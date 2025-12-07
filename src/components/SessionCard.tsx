import { cn } from "@/lib/utils";
import { Clock, TrendingUp, Activity, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SessionCardProps {
  id: string;
  title: string;
  type: "focus" | "recovery" | "micro" | "social" | "emergency";
  start: string;
  end?: string;
  duration: number;
  summary: string;
  stressPeak?: number;
  interventions?: string[];
  className?: string;
}

const typeConfig = {
  focus: { color: "primary", label: "Focus" },
  recovery: { color: "secondary", label: "Recovery" },
  micro: { color: "stress-calm", label: "Micro" },
  social: { color: "accent", label: "Social" },
  emergency: { color: "destructive", label: "Emergency" },
};

export default function SessionCard({
  id,
  title,
  type,
  start,
  duration,
  summary,
  stressPeak,
  interventions = [],
  className,
}: SessionCardProps) {
  const navigate = useNavigate();
  const config = typeConfig[type] || typeConfig.focus;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
  };

  return (
    <button
      onClick={() => navigate(`/sessions/${id}`)}
      className={cn(
        "w-full p-4 rounded-xl text-left transition-all duration-300",
        "bg-muted/30 border border-border/30",
        "hover:bg-muted/50 hover:border-primary/30 hover:scale-[1.02]",
        "group",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <div 
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2",
              `bg-${config.color}/10 text-${config.color} border border-${config.color}/30`
            )}
            style={{
              backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
              color: `hsl(var(--${config.color}))`,
              borderColor: `hsl(var(--${config.color}) / 0.3)`,
            }}
          >
            {config.label}
          </div>

          {/* Title */}
          <h3 className="font-orbitron font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {title}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(start)}
            </span>
            <span>{formatDuration(duration)}</span>
          </div>

          {/* Summary */}
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {summary}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3">
            {stressPeak !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-stress-rising" />
                <span className="text-muted-foreground">Peak: {stressPeak}%</span>
              </div>
            )}
            {interventions.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Activity className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground">
                  {interventions.length} intervention{interventions.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </button>
  );
}
