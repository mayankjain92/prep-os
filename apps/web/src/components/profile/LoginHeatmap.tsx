"use client";

import { useMemo, useState } from "react";
import { Flame, Calendar, CheckCircle2, Trophy, Zap } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

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

  // Generate 26 weeks (182 days) leading up to today (~6 months)
  const { weeks, monthLabels, totalActiveDays } = useMemo(() => {
    const today = new Date();
    const days: { dateStr: string; date: Date; isActive: boolean; formatted: string }[] = [];

    // Calculate start date (182 days ago)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 182);

    let activeCount = 0;
    for (let i = 0; i <= 182; i++) {
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
    let lastAddedIdx = -10;
    weekCols.forEach((w, idx) => {
      const firstDayInWeek = w[0].date;
      const monthIdx = firstDayInWeek.getMonth();
      if (monthIdx !== lastMonth) {
        if (idx - lastAddedIdx >= 3 || idx === 0) {
          months.push({
            label: firstDayInWeek.toLocaleDateString("en-US", { month: "short" }),
            index: idx,
          });
          lastAddedIdx = idx;
        }
        lastMonth = monthIdx;
      }
    });

    return { weeks: weekCols, monthLabels: months, totalActiveDays: activeCount };
  }, [loginSet]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full">
      {/* Telemetry 3-Card Metric Strip (Left 4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-3.5 justify-between">
        {/* Metric 1: Current Streak */}
        <div className="rounded-2xl bg-white dark:bg-[#121212] border border-amber-500/25 dark:border-amber-500/20 p-4.5 flex-1 flex items-center gap-4 transition-all hover:border-amber-500/40 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-500 dark:text-amber-400 leading-tight">
              <AnimatedNumber value={currentStreak} /> Days
            </div>
            <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
              Current Streak
            </div>
          </div>
        </div>

        {/* Metric 2: Longest Streak */}
        <div className="rounded-2xl bg-white dark:bg-[#121212] border border-sky-500/25 dark:border-sky-500/20 p-4.5 flex-1 flex items-center gap-4 transition-all hover:border-sky-500/40 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-500 dark:text-sky-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-sky-600 dark:text-sky-400 leading-tight">
              <AnimatedNumber value={longestStreak} /> Days
            </div>
            <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
              Longest Streak
            </div>
          </div>
        </div>

        {/* Metric 3: Total Active Days */}
        <div className="rounded-2xl bg-white dark:bg-[#121212] border border-emerald-500/25 dark:border-emerald-500/20 p-4.5 flex-1 flex items-center gap-4 transition-all hover:border-emerald-500/40 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              <AnimatedNumber value={totalActiveDays} /> Days
            </div>
            <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
              Total Active Days
            </div>
          </div>
        </div>
      </div>

      {/* 6-Month Heatmap Card (Right 8 cols) */}
      <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 p-5 sm:p-6 space-y-4 overflow-hidden shadow-xs">
        {/* Heatmap Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-neutral-100">
              Daily Login Activity & Heatmap (Past 6 Months)
            </span>
          </div>

          {/* High-Contrast Legend */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-white/10" />
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/80" />
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-300 dark:bg-sky-700" />
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-500" />
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto py-3 bg-slate-50/70 dark:bg-[#0c0c0c] rounded-xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-white/[0.06]">
          <div className="min-w-[620px] flex flex-col gap-2">
            {/* Month Labels Header */}
            <div className="flex text-[11px] text-slate-400 dark:text-neutral-400 font-medium pl-8 justify-between pr-2 select-none">
              {monthLabels.map((m, idx) => (
                <span key={idx} className="w-14 text-left">
                  {m.label}
                </span>
              ))}
            </div>

            {/* Matrix Row with Mon/Wed/Fri labels and Weeks */}
            <div className="flex gap-2.5 items-center">
              <div className="flex flex-col justify-between text-[11px] text-slate-400 dark:text-neutral-500 font-mono py-1 w-6 text-right h-[86px] select-none">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div className="grid grid-flow-col grid-rows-7 flex-1 gap-1 max-w-2xl">
                {weeks.map((week) =>
                  week.map((day) => {
                    const isToday = day.dateStr === todayStr;
                    return (
                      <div
                        key={day.dateStr}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3.5 h-3.5 rounded-xs transition-all duration-150 cursor-pointer ${
                          day.isActive
                            ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)] dark:shadow-[0_0_10px_rgba(56,189,248,0.8)] hover:scale-125 hover:z-10"
                            : "bg-slate-200/70 dark:bg-neutral-800/80 hover:border hover:border-slate-400 dark:hover:border-neutral-500 hover:scale-110"
                        } ${
                          isToday
                            ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-[#121212] animate-pulse"
                            : ""
                        }`}
                        title={`${day.formatted}: ${day.isActive ? "Active login" : "No activity"}`}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover / Detail Status Bar */}
        <div className="h-8 px-3 py-1 bg-slate-100/70 dark:bg-neutral-800/50 border border-slate-200/70 dark:border-white/[0.06] rounded-xl flex items-center justify-between text-xs">
          {hoveredDay ? (
            <div className="flex items-center gap-2 font-medium">
              <span className="text-slate-800 dark:text-neutral-200">{hoveredDay.formatted}:</span>
              {hoveredDay.isActive ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Login Recorded 🔥
                </span>
              ) : (
                <span className="text-slate-500 dark:text-neutral-400 font-normal">
                  No activity recorded for this day
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 dark:text-neutral-400 italic text-[11px]">
              Hover over any square in the grid to view daily login records
            </span>
          )}
          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono font-semibold">
            {totalActiveDays} days logged
          </span>
        </div>
      </div>
    </div>
  );
}
