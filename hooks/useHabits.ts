"use client";

import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  HABITS_QUERY,
  CREATE_HABIT_MUTATION,
  TOGGLE_HABIT_ACTIVE_MUTATION,
} from "@/graphql/operations";
import type { Habit, CreateHabitInput, ToggleHabitActiveInput } from "@/types/api";

interface HabitsQueryData {
  habits: Habit[];
}

export function useHabits() {
  const { data, loading, error, refetch } = useQuery<HabitsQueryData>(HABITS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [createHabitMutation, createState] = useMutation(CREATE_HABIT_MUTATION, {
    refetchQueries: [HABITS_QUERY],
  });

  const [toggleActiveMutation, toggleState] = useMutation(TOGGLE_HABIT_ACTIVE_MUTATION, {
    refetchQueries: [HABITS_QUERY],
  });

  const createHabit = useCallback(
    async (input: CreateHabitInput) => {
      await createHabitMutation({ variables: { input } });
    },
    [createHabitMutation]
  );

  const toggleHabitActive = useCallback(
    async (input: ToggleHabitActiveInput) => {
      await toggleActiveMutation({ variables: { input } });
    },
    [toggleActiveMutation]
  );

  return {
    habits: data?.habits ?? [],
    loading,
    error,
    refetch,
    createHabit,
    createLoading: createState.loading,
    createError: createState.error,
    toggleHabitActive,
    toggleLoading: toggleState.loading,
  };
}
