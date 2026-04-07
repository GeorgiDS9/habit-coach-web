"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { HabitItem } from "@/components/habits/HabitItem";
import type { Habit } from "@/types/api";

interface HabitListProps {
  habits: Habit[];
  loading: boolean;
  error?: unknown;
  onToggleActive: (habitId: string, isActive: boolean) => Promise<void>;
  isToggling: boolean;
}

export function HabitList({
  habits,
  loading,
  error,
  onToggleActive,
  isToggling,
}: HabitListProps) {
  if (loading && habits.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <p>Failed to load habits. Please check your connection or try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-red-100 px-3 py-1.5 font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Retry
        </button>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
        <p className="text-gray-500">No habits yet. Create your first one above!</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2" aria-label="Habits list">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitItem
            habit={habit}
            onToggleActive={onToggleActive}
            isToggling={isToggling}
          />
        </li>
      ))}
    </ul>
  );
}
