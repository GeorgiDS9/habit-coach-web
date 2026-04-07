"use client";

import { use } from "react";
import Link from "next/link";
import { useHabits } from "@/hooks/useHabits";
import { useCheckIns } from "@/hooks/useCheckIns";
import { CheckInGrid, CheckInHistory } from "@/components/checkins/CheckInGrid";
import { Card, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { todayUTC, daysAgoUTC } from "@/lib/format-date";
import { ROUTES } from "@/constants/routes";

export default function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { habits, loading: habitsLoading } = useHabits();
  const habit = habits.find((h) => h.id === id);

  const to = todayUTC();
  const from = daysAgoUTC(6);

  const { logs, loading: logsLoading, logCheckIn, removeCheckIn, logLoading, removeLoading } =
    useCheckIns(id, from, to);

  if (habitsLoading && !habit) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Habit not found.</p>
        <Link href={ROUTES.HABITS} className="mt-2 inline-block text-indigo-600 hover:underline text-sm">
          Back to habits
        </Link>
      </div>
    );
  }

  const dates = Array.from({ length: 7 }, (_, i) => daysAgoUTC(6 - i));
  const checkInLoading = logLoading || removeLoading;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={ROUTES.HABITS} className="text-sm text-indigo-600 hover:underline">
          ← Back to habits
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{habit.title}</h1>
        {habit.description && (
          <p className="mt-1 text-gray-500">{habit.description}</p>
        )}
        {habit.currentStreak > 0 && (
          <p className="mt-2 text-sm font-medium text-indigo-600">
            🔥 Current streak: {habit.currentStreak} day{habit.currentStreak !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <Card>
        <CardTitle className="mb-4">Check-in</CardTitle>
        <CheckInGrid
          habitId={id}
          dates={dates}
          logs={logs}
          onLogCheckIn={(habitId, date) => logCheckIn({ habitId, date })}
          onRemoveCheckIn={(habitId, date) => removeCheckIn({ habitId, date })}
          isLoading={checkInLoading}
        />
      </Card>

      <Card>
        <CardTitle className="mb-4">History</CardTitle>
        <CheckInHistory logs={logs} loading={logsLoading && logs.length === 0} />
      </Card>
    </div>
  );
}
