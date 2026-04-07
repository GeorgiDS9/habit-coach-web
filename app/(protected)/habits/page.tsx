"use client";

import { useHabits } from "@/hooks/useHabits";
import { HabitList } from "@/components/habits/HabitList";
import { CreateHabitForm } from "@/components/habits/CreateHabitForm";

export default function HabitsPage() {
  const {
    habits,
    loading,
    error,
    createHabit,
    createLoading,
    createError,
    toggleHabitActive,
    toggleLoading,
  } = useHabits();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
      </div>

      <CreateHabitForm
        onCreate={createHabit}
        isLoading={createLoading}
        error={createError}
      />

      <HabitList
        habits={habits}
        loading={loading}
        error={error}
        onToggleActive={(habitId, isActive) =>
          toggleHabitActive({ habitId, isActive })
        }
        isToggling={toggleLoading}
      />
    </div>
  );
}
