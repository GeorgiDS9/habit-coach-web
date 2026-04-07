"use client";

import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  HABIT_LOGS_QUERY,
  LOG_CHECK_IN_MUTATION,
  REMOVE_CHECK_IN_MUTATION,
} from "@/graphql/operations";
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

  const refetchQueries = [{ query: HABIT_LOGS_QUERY, variables: { habitId, from, to } }];

  const [logCheckInMutation, logState] = useMutation(LOG_CHECK_IN_MUTATION, {
    refetchQueries,
  });

  const [removeCheckInMutation, removeState] = useMutation(REMOVE_CHECK_IN_MUTATION, {
    refetchQueries,
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
