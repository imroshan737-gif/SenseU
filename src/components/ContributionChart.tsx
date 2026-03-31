// src/components/ContributionChart.tsx

import React, { useMemo } from "react";

interface ContributionDay {
  date: string;       // "YYYY-MM-DD"
  count: number;      // 0–4 intensity level
}

interface ContributionChartProps {
  data?: ContributionDay[];
  title?: string;
}

// Generate mock data for the past year if no data is passed
function generateMockData(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    // Sparse random data, ramping up recently
    const recency = 1 - i / 364;
    const rand = Math.random();
    let count = 0;
    if (rand < recency * 0.4) count = Math.floor(Math.random() * 4) + 1;
    days.push({ date: dateStr, count });
  }
  return days;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getColor(count: number): string {
  if (count === 0) return "bg-[#1a2535]";
  if (count === 1) return "bg-[#0e4429]";
  if (count === 2) return "bg-[#006d32]";
  if (count === 3) return "bg-[#26a641]";
  return "bg-[#39d353]";
}

const ContributionChart: React.FC<ContributionChartProps> = ({
  data,
  title = "Wellness Activity",
}) => {
  const contributions = useMemo(() => data ?? generateMockData(), [data]);

  // Build a grid: weeks as columns, days (0=Sun..6=Sat) as rows
  const weeks = useMemo(() => {
    const grid: (ContributionDay | null)[][] = [];
    // Pad the start so the first day aligns to its weekday
    const firstDay = new Date(contributions[0].date).getDay(); // 0=Sun
    let current: (ContributionDay | null)[] = Array(firstDay).fill(null);
    for (const day of contributions) {
      current.push(day);
      if (current.length === 7) {
        grid.push(current);
        current = [];
      }
    }
    if (current.length > 0) {
      while (current.length < 7) current.push(null);
      grid.push(current);
    }
    return grid;
  }, [contributions]);

  // Month labels: find the first week of each month
  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
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
  }, [weeks]);

  const total = contributions.filter((d) => d.count > 0).length;

  return (
    <div className="rounded-2xl border border-cyan-900/40 bg-[#0d1b2a] p-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
          {title}
        </h3>
        <span className="text-[#4ade80] text-xs font-mono">
          {total} active days
        </span>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {weeks.map((_, wi) => {
              const label = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div key={wi} className="w-[13px] mr-[2px] text-[9px] text-gray-500 truncate">
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>

          {/* Day rows */}
          <div className="flex">
            {/* Day-of-week labels */}
            <div className="flex flex-col mr-2">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <div
                  key={d}
                  className="h-[13px] mb-[2px] text-[9px] text-gray-500 w-6 flex items-center"
                >
                  {d % 2 === 1 ? DAYS[d].slice(0, 3) : ""}
                </div>
              ))}
            </div>

            {/* Cells */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col mr-[2px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={day ? `${day.date}: ${day.count} sessions` : ""}
                    className={`w-[13px] h-[13px] mb-[2px] rounded-[2px] transition-all duration-150 hover:ring-1 hover:ring-cyan-400/60 ${
                      day ? getColor(day.count) : "opacity-0 pointer-events-none"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-[10px] text-gray-500 mr-1">Less</span>
            {[0, 1, 2, 3, 4].map((c) => (
              <div
                key={c}
                className={`w-[13px] h-[13px] rounded-[2px] ${getColor(c)}`}
              />
            ))}
            <span className="text-[10px] text-gray-500 ml-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionChart;
