"use client";

import { useMemo, useState } from "react";
import { Flame, Calendar, CheckCircle2, Trophy, Zap } from "lucide-react";

interface LoginHeatmapProps {
  loginDates?: string[]; // Array of YYYY-MM-DD strings
  currentStreak?: number;
  longestStreak?: number;
}

export function LoginHeatmap({ loginDates = [], currentStreak = 0, longestStreak = 0 }: LoginHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ dateStr: string; isActive: boolean; formatted: string } | null>(null);

  // Compute active days set, automatically including streak days if loginDates array is sparse
  const loginSet = useMemo(() => {
    const set = new Set(loginDates);
    if (currentStreak > 0) {
      const today = new Date();
      for (let i = 0; i < currentStreak; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        set.add(d.toISOString().split("T")[0]);
      }
    }
    return set;
  }, [loginDates, currentStreak]);

  // Generate 52 weeks (364 days) leading up to today
  const { weeks, monthLabels, totalActiveDays } = useMemo(() => {
    const today = new Date();
    const days: { dateStr: string; date: Date; isActive: boolean; formatted: string }[] = [];

    // Calculate start date (52 weeks ago, aligned to previous Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    let activeCount = 0;
    for (let i = 0; i <= 364; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const isActive = loginSet.has(dateStr);
      if (isActive) activeCount++;

      const formatted = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      days.push({ dateStr, date: d, isActive, formatted });
    }

    // Group days into weeks (columns) of 7 days
    const weekCols: (typeof days)[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekCols.push(days.slice(i, i + 7));
    }

    // Extract month label positions
    const months: { label: string; index: number }[] = [];
    let lastMonth = -1;
    weekCols.forEach((w, idx) => {
      const firstDayInWeek = w[0].date;
      const monthIdx = firstDayInWeek.getMonth();
      if (monthIdx !== lastMonth) {
        months.push({
          label: firstDayInWeek.toLocaleDateString("en-US", { month: "short" }),
          index: idx,
        });
        lastMonth = monthIdx;
      }
    });

    return { weeks: weekCols, monthLabels: months, totalActiveDays: activeCount };
  }, [loginSet]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <div className="space-y-6">
      {/* Metric Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-500">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-amber-500">{currentStreak} Days</div>
            <div className="text-xs text-muted-foreground font-medium">Current Streak</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 rounded-xl bg-blue-500/20 text-xblue">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-xblue">{longestStreak} Days</div>
            <div className="text-xs text-muted-foreground font-medium">Longest Streak</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-500">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-emerald-500">{totalActiveDays} Days</div>
            <div className="text-xs text-muted-foreground font-medium">Total Active Days</div>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <Calendar className="h-4 w-4 text-xblue" />
            <span>Daily Login Activity & Heatmap (Past 365 Days)</span>
          </div>

          {/* High Contrast Legend */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1.5 items-center">
              <div title="Inactive" className="h-3.5 w-3.5 rounded-[3px] bg-white dark:bg-zinc-700/60 border border-gray-300 dark:border-zinc-600/60" />
              <div title="Low" className="h-3.5 w-3.5 rounded-[3px] bg-xblue/40 border border-xblue/50" />
              <div title="Medium" className="h-3.5 w-3.5 rounded-[3px] bg-xblue/75 border border-xblue/80" />
              <div title="High" className="h-3.5 w-3.5 rounded-[3px] bg-xblue border border-sky-300 shadow-xs" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid container with horizontal scroll for responsiveness */}
        <div className="overflow-x-auto pb-3 pt-1 custom-scrollbar">
          <div className="min-w-[720px]">
            {/* Month Labels Header */}
            <div className="flex text-[10px] text-muted-foreground font-bold mb-2 ml-7 relative h-4 select-none">
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute"
                  style={{ left: `${(m.index / weeks.length) * 100}%` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="flex gap-2 items-start">
              {/* Day Labels Column */}
              <div className="flex flex-col justify-between text-[9px] text-muted-foreground font-bold pr-1 py-0.5 select-none h-[98px]">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Heatmap Matrix */}
              <div className="flex gap-1 flex-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day) => {
                      const isToday = day.dateStr === todayStr;
                      return (
                        <div
                          key={day.dateStr}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-3 h-3 rounded-[3px] transition-all duration-150 cursor-pointer relative ${
                            day.isActive
                              ? "bg-xblue border border-sky-400/60 shadow-[0_0_8px_rgba(29,155,240,0.5)] dark:shadow-[0_0_10px_rgba(29,155,240,0.7)] hover:scale-130 hover:z-20 ring-1 ring-sky-300"
                              : "bg-white dark:bg-zinc-700/60 border border-gray-300 dark:border-zinc-600/60 hover:bg-slate-100 dark:hover:bg-zinc-600 hover:scale-125 hover:z-10"
                          } ${isToday ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-background font-bold" : ""}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tooltip Detail Bar */}
        <div className="h-8 px-3.5 py-1 bg-muted/40 border border-border/60 rounded-xl flex items-center justify-between text-xs">
          {hoveredDay ? (
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-foreground">{hoveredDay.formatted}:</span>
              {hoveredDay.isActive ? (
                <span className="text-emerald-500 flex items-center gap-1 font-extrabold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Active Login Recorded 🔥
                </span>
              ) : (
                <span className="text-muted-foreground font-medium">No activity recorded for this day</span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground italic text-[11px] font-medium">
              💡 Hover over any square in the grid to view daily login records
            </span>
          )}
          <span className="text-[11px] text-muted-foreground font-mono font-bold">{totalActiveDays} days logged</span>
        </div>
      </div>
    </div>
  );
}
