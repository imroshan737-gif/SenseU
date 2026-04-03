import React, { useMemo, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionChartProps {
  title?: string;
  refreshKey?: string;
}

function getColor(count: number): React.CSSProperties {
  if (count === 0) return { backgroundColor: "#1a2535" };
  if (count === 1) return { backgroundColor: "#0e4429" };
  if (count === 2) return { backgroundColor: "#006d32" };
  if (count === 3) return { backgroundColor: "#26a641" };
  return { backgroundColor: "#39d353" };
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

const ContributionChart: React.FC<ContributionChartProps> = ({
  title = "Wellness Activity",
  refreshKey,
}) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = localStorage.getItem("neuroaura_user_id") || "anonymous";
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data, error } = await supabase
        .from("sessions")
        .select("completed_at")
        .eq("user_id", userId)
        .gte("completed_at", oneYearAgo.toISOString().split("T")[0]);

      if (error) { console.error(error); setLoading(false); return; }

      const countMap: Record<string, number> = {};
      (data || []).forEach((row: { completed_at: string }) => {
        countMap[row.completed_at] = (countMap[row.completed_at] || 0) + 1;
      });

      const result = Object.entries(countMap).map(([date, count]) => ({
        date,
        count: Math.min(count, 4),
      }));

      setContributions(result);
      setLoading(false);
    };

    fetchSessions();
  }, [refreshKey]);

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

  return (
    <div className="rounded-2xl border border-cyan-900/40 bg-[#0d1b2a] p-5 w-full">
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
                style={{ height: "calc((100% - 24px) / 7)", marginBottom: "2px", minHeight: "13px" }}
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
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={day ? `${day.date}: ${day.count} sessions` : ""}
                    style={day ? { ...getColor(day.count), aspectRatio: "1" } : { aspectRatio: "1" }}
                    className={`w-full rounded-[2px] transition-all duration-150 hover:ring-1 hover:ring-cyan-400/60 ${
                      !day ? "opacity-0 pointer-events-none" : ""
                    }`}
                  />
                ))}
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
  );
};

export default ContributionChart;
