"use client";

import { formatShortDate, todayUTC } from "@/lib/format-date";
import type { HabitLog } from "@/types/api";

interface CheckInGridProps {
  habitId: string;
  dates: string[];
  logs: HabitLog[];
  onLogCheckIn: (habitId: string, date: string) => Promise<void>;
  onRemoveCheckIn: (habitId: string, date: string) => Promise<void>;
  isLoading: boolean;
}

export function CheckInGrid({
  habitId,
  dates,
  logs,
  onLogCheckIn,
  onRemoveCheckIn,
  isLoading,
}: CheckInGridProps) {
  const today = todayUTC();
  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  );

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-gray-700">
        Last 7 days (rolling window, UTC)
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {dates.map((date) => {
          const done = completedDates.has(date);
          const isFuture = date > today;
          const isDisabled = isLoading || isFuture;

          return (
            <button
              key={date}
              disabled={isDisabled}
              onClick={() =>
                done
                  ? onRemoveCheckIn(habitId, date)
                  : onLogCheckIn(habitId, date)
              }
              aria-label={
                isFuture
                  ? `${formatShortDate(date)} — future date, cannot check in`
                  : `${done ? "Uncheck" : "Check"} ${formatShortDate(date)}`
              }
              aria-pressed={done && !isFuture ? true : undefined}
              title={isFuture ? "Cannot log future check-ins" : undefined}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors ${
                isFuture
                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                  : done
                  ? "border-indigo-300 bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  : "border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              <span className="text-lg leading-none">
                {isFuture ? "·" : done ? "✅" : "⬜"}
              </span>
              <span className="text-[10px] leading-none">{formatShortDate(date)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CheckInHistoryProps {
  logs: HabitLog[];
  loading: boolean;
}

export function CheckInHistory({ logs, loading }: CheckInHistoryProps) {
  if (loading) return <p className="text-sm text-gray-400">Loading history…</p>;
  if (logs.length === 0) return <p className="text-sm text-gray-400">No check-ins yet.</p>;

  return (
    <ul className="flex flex-col gap-1">
      {logs
        .slice()
        .reverse()
        .map((log) => (
          <li key={log.id} className="flex items-center gap-2 text-sm text-gray-600">
            <span className={log.completed ? "text-green-600" : "text-gray-400"}>
              {log.completed ? "✓" : "–"}
            </span>
            <span>{formatShortDate(log.date)}</span>
            {log.note && <span className="text-gray-400 italic">· {log.note}</span>}
          </li>
        ))}
    </ul>
  );
}
