"use client";

import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  HABITS_QUERY,
  CREATE_HABIT_MUTATION,
  TOGGLE_HABIT_ACTIVE_MUTATION,
} from "@/graphql/operations";
import toast from "react-hot-toast";
import { extractErrorMessage } from "@/lib/api-error";

export function useHabits() {
  const { data, loading, error, refetch } = useQuery(HABITS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [createHabitMutation, createState] = useMutation(CREATE_HABIT_MUTATION, {
    refetchQueries: [HABITS_QUERY],
  });

  const [toggleActiveMutation, toggleState] = useMutation(TOGGLE_HABIT_ACTIVE_MUTATION, {
    refetchQueries: [HABITS_QUERY],
  });

  const createHabit = useCallback(
    async (input: any) => {
      try {
        await createHabitMutation({ variables: { input } });
        toast.success("Habit created!");
      } catch (err) {
        toast.error(extractErrorMessage(err));
      }
    },
    [createHabitMutation]
  );

  const toggleHabitActive = useCallback(
    async (input: any) => {
      try {
        const { data } = await toggleActiveMutation({ variables: { input } });
        const isActive = data?.toggleHabitActive?.isActive;
        toast.success(isActive ? "Habit activated" : "Habit deactivated");
      } catch (err) {
        toast.error(extractErrorMessage(err));
      }
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
