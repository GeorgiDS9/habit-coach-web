"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Habit } from "@/types/api";

interface HabitItemProps {
  habit: Habit;
  onToggleActive: (habitId: string, isActive: boolean) => Promise<void>;
  isToggling: boolean;
}

export function HabitItem({ habit, onToggleActive, isToggling }: HabitItemProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
        habit.isActive
          ? "border-gray-200 bg-white"
          : "border-gray-100 bg-gray-50 opacity-70"
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <Link
          href={`/habits/${habit.id}`}
          className="font-medium text-gray-900 hover:text-indigo-700 transition-colors"
        >
          {habit.title}
        </Link>
        {habit.description && (
          <p className="text-sm text-gray-500">{habit.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-400">
            {habit.isActive ? "Active" : "Paused"}
          </span>
          {habit.currentStreak > 0 && (
            <span className="text-xs font-medium text-indigo-600">
              🔥 {habit.currentStreak} day streak
            </span>
          )}
        </div>
      </div>

      <Button
        variant={habit.isActive ? "secondary" : "ghost"}
        size="sm"
        isLoading={isToggling}
        onClick={() => onToggleActive(habit.id, !habit.isActive)}
        aria-label={habit.isActive ? "Pause habit" : "Resume habit"}
      >
        {habit.isActive ? "Pause" : "Resume"}
      </Button>
    </div>
  );
}
