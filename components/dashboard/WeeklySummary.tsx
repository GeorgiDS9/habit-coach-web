"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { formatShortDate } from "@/lib/format-date";
import type { HabitWithWeeklyStats } from "@/types/api";

interface WeeklySummaryProps {
  habits: HabitWithWeeklyStats[];
}

export function WeeklySummary({ habits }: WeeklySummaryProps) {
  const activeHabits = habits.filter((h) => h.isActive);

  if (activeHabits.length === 0) {
    return (
      <Card>
        <CardTitle className="mb-4">Weekly summary</CardTitle>
        <p className="text-sm text-gray-400">No active habits to show.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle className="mb-4">Weekly summary</CardTitle>
      <div className="flex flex-col gap-5">
        {activeHabits.map((habit) => {
          const { dates, counts } = habit.weeklyStats;
          const totalCompleted = counts.reduce((sum, c) => sum + c, 0);

          return (
            <div key={habit.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">{habit.title}</span>
                <span className="text-xs text-gray-400">
                  {totalCompleted}/{dates.length} days
                </span>
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}>
                {dates.map((date, i) => (
                  <div key={date} className="flex flex-col items-center gap-1">
                    <div
                      className={`h-6 w-full rounded ${
                        counts[i] ? "bg-indigo-500" : "bg-gray-100"
                      }`}
                      title={`${formatShortDate(date)}: ${counts[i] ? "done" : "missed"}`}
                    />
                    <span className="text-[9px] text-gray-400 leading-none">
                      {formatShortDate(date).slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
