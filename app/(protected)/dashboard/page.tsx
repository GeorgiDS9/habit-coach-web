"use client";

import { useQuery } from "@apollo/client/react";
import { HABIT_WEEKLY_STATS_QUERY } from "@/graphql/operations";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";
import { Spinner } from "@/components/ui/Spinner";
import { todayUTC, daysAgoUTC } from "@/lib/format-date";
import type { HabitWithWeeklyStats } from "@/types/api";

interface DashboardQueryData {
  habits: HabitWithWeeklyStats[];
}

// NOTE: The API does not currently expose a `longestStreak` field on Habit.
// This is an API gap — a future sprint can add it to the schema.
// For now, we derive the best current streak across all habits.

export default function DashboardPage() {
  const to = todayUTC();
  const from = daysAgoUTC(6);

  const { data, loading, error } = useQuery<DashboardQueryData>(HABIT_WEEKLY_STATS_QUERY, {
    variables: { from, to },
    fetchPolicy: "cache-and-network",
  });

  if (loading && !data) {
    return (
      <div className="flex justify-center py-16" role="status" aria-label="Loading dashboard">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Failed to load dashboard. Please refresh the page.
      </div>
    );
  }

  const habits = data?.habits ?? [];
  const activeHabits = habits.filter((h) => h.isActive);

  const bestStreak = habits.reduce(
    (max, h) => Math.max(max, h.currentStreak),
    0
  );

  const totalCompletionsThisWeek = habits.reduce((sum, h) => {
    return sum + h.weeklyStats.counts.reduce((s, c) => s + c, 0);
  }, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Active habits"
          value={activeHabits.length}
          subtitle={`of ${habits.length} total`}
        />
        <StatsCard
          title="Best current streak"
          value={bestStreak > 0 ? `${bestStreak}d` : "—"}
          subtitle="longest active run across all habits right now"
          highlight={bestStreak > 0}
        />
        <StatsCard
          title="Check-ins this week"
          value={totalCompletionsThisWeek}
          subtitle="rolling 7-day window (UTC)"
        />
      </div>

      <WeeklySummary habits={habits} />
    </div>
  );
}
