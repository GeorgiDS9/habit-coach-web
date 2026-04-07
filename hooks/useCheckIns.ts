"use client";

import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  HABIT_LOGS_QUERY,
  HABITS_QUERY,
  HABIT_WEEKLY_STATS_QUERY,
  LOG_CHECK_IN_MUTATION,
  REMOVE_CHECK_IN_MUTATION,
} from "@/graphql/operations";
import { todayUTC, daysAgoUTC } from "@/lib/format-date";
import type { HabitLog, LogCheckInInput, RemoveCheckInInput } from "@/types/api";

interface HabitLogsQueryData {
  habitLogs: HabitLog[];
}

interface HabitLogsVariables {
  habitId: string;
  from: string;
  to: string;
}

export function useCheckIns(habitId: string, from: string, to: string) {
  const { data, loading, error } = useQuery<HabitLogsQueryData, HabitLogsVariables>(
    HABIT_LOGS_QUERY,
    {
      variables: { habitId, from, to },
      fetchPolicy: "cache-and-network",
      skip: !habitId,
    }
  );

  // After a check-in mutation we need to refresh:
  // 1. The logs for this habit (so the grid updates)
  // 2. HABITS_QUERY — so currentStreak on the habit card refreshes immediately
  // 3. HABIT_WEEKLY_STATS_QUERY — so dashboard cards update without re-navigation
  const dashboardVariables = {
    from: daysAgoUTC(6),
    to: todayUTC(),
  };

  const refetchQueries = [
    { query: HABIT_LOGS_QUERY, variables: { habitId, from, to } },
    { query: HABITS_QUERY },
    { query: HABIT_WEEKLY_STATS_QUERY, variables: dashboardVariables },
  ];

  const [logCheckInMutation, logState] = useMutation(LOG_CHECK_IN_MUTATION, {
    refetchQueries,
    awaitRefetchQueries: true,
  });

  const [removeCheckInMutation, removeState] = useMutation(REMOVE_CHECK_IN_MUTATION, {
    refetchQueries,
    awaitRefetchQueries: true,
  });

  const logCheckIn = useCallback(
    async (input: LogCheckInInput) => {
      await logCheckInMutation({ variables: { input } });
    },
    [logCheckInMutation]
  );

  const removeCheckIn = useCallback(
    async (input: RemoveCheckInInput) => {
      await removeCheckInMutation({ variables: { input } });
    },
    [removeCheckInMutation]
  );

  return {
    logs: data?.habitLogs ?? [],
    loading,
    error,
    logCheckIn,
    removeCheckIn,
    logLoading: logState.loading,
    removeLoading: removeState.loading,
  };
}
