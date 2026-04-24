import React, { useMemo, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface SessionRow {
  id: string;
  session_type: string;
  title: string | null;
  completed_at: string;
  created_at: string;
}

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionChartProps {
  title?: string;
  refreshKey?: string;
}

function getColor(count: number): React.CSSProperties {
  if (count === 0) return { backgroundColor: "#0d1f2d" };
  if (count === 1) return { backgroundColor: "#003d4d" };
  if (count === 2) return { backgroundColor: "#006d7a" };
  if (count === 3) return { backgroundColor: "#00a8b5" };
  return { backgroundColor: "#00f0ff" };
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function buildYearGrid(data: ContributionDay[]) {
  const map: Record<string, number> = {};
  data.forEach((d) => { map[d.date] = d.count; });

  const days: ContributionDay[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    days.push({ date: dateStr, count: map[dateStr] || 0 });
  }

  const grid: (ContributionDay | null)[][] = [];
  const firstDay = new Date(days[0].date).getDay();
  let current: (ContributionDay | null)[] = Array(firstDay).fill(null);
  for (const day of days) {
    current.push(day);
    if (current.length === 7) { grid.push(current); current = []; }
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    grid.push(current);
  }
  return { days, grid };
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

const ContributionChart: React.FC<ContributionChartProps> = ({
  title = "Wellness Activity",
  refreshKey,
}) => {
  const [allSessions, setAllSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = localStorage.getItem("neuroaura_user_id") || "anonymous";
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data, error } = await supabase
        .from("sessions")
        .select("id, session_type, title, completed_at, created_at")
        .eq("user_id", userId)
        .gte("completed_at", oneYearAgo.toISOString().split("T")[0])
        .order("created_at", { ascending: false });

      if (error) { console.error(error); setLoading(false); return; }

      setAllSessions((data || []) as SessionRow[]);
      setLoading(false);
    };

    fetchSessions();
  }, [refreshKey]);

  const contributions = useMemo<ContributionDay[]>(() => {
    const countMap: Record<string, number> = {};
    allSessions.forEach((row) => {
      countMap[row.completed_at] = (countMap[row.completed_at] || 0) + 1;
    });
    return Object.entries(countMap).map(([date, count]) => ({
      date,
      count: Math.min(count, 4),
    }));
  }, [allSessions]);

  const sessionsByDate = useMemo<Record<string, SessionRow[]>>(() => {
    const map: Record<string, SessionRow[]> = {};
    allSessions.forEach((row) => {
      if (!map[row.completed_at]) map[row.completed_at] = [];
      map[row.completed_at].push(row);
    });
    return map;
  }, [allSessions]);

  const { days, grid } = useMemo(() => buildYearGrid(contributions), [contributions]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
      const firstReal = week.find((d) => d !== null);
      if (firstReal) {
        const m = new Date(firstReal.date).getMonth();
        if (m !== lastMonth) {
          labels.push({ label: MONTHS[m], weekIndex: wi });
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [grid]);

  const total = days.filter((d) => d.count > 0).length;
  const totalWeeks = grid.length;

  const selectedSessions = selectedDate ? sessionsByDate[selectedDate] || [] : [];

  return (
    <>
      <div className="rounded-2xl border border-cyan-900/40 bg-[#0d1b2a] p-4 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
            {title}
          </h3>
          <span className="text-[#4ade80] text-xs font-mono">
            {loading ? "Loading..." : `${total} active days`}
          </span>
        </div>

        {/* Chart - full width */}
        <div className="w-full">
          {/* Month labels row */}
          <div className="flex w-full mb-1 pl-8">
            {grid.map((_, wi) => {
              const label = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div
                  key={wi}
                  style={{ width: `${100 / totalWeeks}%` }}
                  className="text-[9px] text-gray-500 truncate"
                >
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid rows */}
          <div className="flex w-full">
            {/* Day labels */}
            <div className="flex flex-col mr-2 shrink-0">
              {[0,1,2,3,4,5,6].map((d) => (
                <div
                  key={d}
                  className="text-[9px] text-gray-500 w-6 flex items-center"
                  style={{ height: "calc((100% - 24px) / 7)", marginBottom: "2px", minHeight: "11px" }}
                >
                  {d % 2 === 1 ? DAYS[d].slice(0, 3) : ""}
                </div>
              ))}
            </div>

            {/* Week columns - stretch to fill */}
            <div className="flex w-full gap-[2px]">
              {grid.map((week, wi) => (
                <div
                  key={wi}
                  className="flex flex-col gap-[2px] flex-1"
                >
                  {week.map((day, di) => {
                    const realCount = day ? (sessionsByDate[day.date]?.length || 0) : 0;
                    return (
                      <button
                        key={di}
                        type="button"
                        disabled={!day || realCount === 0}
                        onClick={() => day && realCount > 0 && setSelectedDate(day.date)}
                        title={day ? `${day.date}: ${realCount} session${realCount === 1 ? "" : "s"}` : ""}
                        style={day ? { ...getColor(day.count), aspectRatio: "1", maxHeight: "11px" } : { aspectRatio: "1", maxHeight: "11px" }}
                        className={`w-full rounded-[2px] transition-all duration-150 hover:ring-1 hover:ring-cyan-400/60 ${
                          !day ? "opacity-0 pointer-events-none" : ""
                        } ${realCount > 0 ? "cursor-pointer" : "cursor-default"}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-[10px] text-gray-500 mr-1">Less</span>
            {[0,1,2,3,4].map((c) => (
              <div
                key={c}
                style={getColor(c)}
                className="w-[13px] h-[13px] rounded-[2px]"
              />
            ))}
            <span className="text-[10px] text-gray-500 ml-1">More</span>
          </div>
        </div>
      </div>

      <Sheet open={!!selectedDate} onOpenChange={(o) => !o && setSelectedDate(null)}>
        <SheetContent
          side="right"
          className="bg-[#0d1b2a] border-l border-cyan-900/40 text-cyan-100 w-[380px] sm:max-w-md"
        >
          <SheetHeader>
            <SheetTitle className="text-cyan-300 tracking-wide">
              {selectedDate ? formatDateLabel(selectedDate) : ""}
            </SheetTitle>
            <SheetDescription className="text-cyan-500/70">
              {selectedSessions.length} session{selectedSessions.length === 1 ? "" : "s"} completed on this day
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            {selectedSessions.length === 0 && (
              <p className="text-sm text-cyan-500/60">No sessions found.</p>
            )}
            {selectedSessions.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-cyan-900/40 bg-[#0a1622] p-3 hover:border-cyan-700/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-300 text-sm font-semibold capitalize">
                    {s.session_type}
                  </span>
                  <span className="text-[10px] text-cyan-500/70 font-mono">
                    {formatTime(s.created_at)}
                  </span>
                </div>
                {s.title && (
                  <p className="text-xs text-cyan-100/80">{s.title}</p>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ContributionChart;
