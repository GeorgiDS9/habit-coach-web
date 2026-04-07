"use client";

import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/format-date";
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
  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  );

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-gray-700">Last 7 days</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {dates.map((date) => {
          const done = completedDates.has(date);
          return (
            <button
              key={date}
              disabled={isLoading}
              onClick={() =>
                done
                  ? onRemoveCheckIn(habitId, date)
                  : onLogCheckIn(habitId, date)
              }
              aria-label={`${done ? "Uncheck" : "Check"} ${formatShortDate(date)}`}
              aria-pressed={done}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors ${
                done
                  ? "border-indigo-300 bg-indigo-100 text-indigo-800"
                  : "border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              <span className="text-lg leading-none">{done ? "✅" : "⬜"}</span>
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

// Re-export Button to avoid unused import warning in the consuming file
export { Button };
