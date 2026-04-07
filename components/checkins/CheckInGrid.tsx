import { Skeleton } from "@/components/ui/Skeleton";
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
    <section className="flex flex-col gap-3" aria-labelledby="check-in-grid-title">
      <h3 id="check-in-grid-title" className="text-sm font-semibold text-gray-800">
        Check-ins (rolling week, UTC)
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const done = completedDates.has(date);
          const isToday = date === today;
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
                  : `${isToday ? "Today, " : ""}${done ? "Uncheck" : "Check"} ${formatShortDate(date)}`
              }
              aria-pressed={done && !isFuture ? true : undefined}
              title={isFuture ? "Cannot log future check-ins" : (isToday ? "Today" : undefined)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95 ${
                isFuture
                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                  : done
                  ? "border-indigo-300 bg-indigo-100/80 text-indigo-800 hover:bg-indigo-200"
                  : isToday
                  ? "ring-2 ring-indigo-500 border-indigo-200 bg-white text-indigo-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm"
              }`}
            >
              <span className="text-xl leading-none">
                {isFuture ? "·" : done ? "✅" : "⬜"}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-tight leading-none ${isToday ? "text-indigo-600" : ""}`}>
                {isToday ? "Today" : formatShortDate(date)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface CheckInHistoryProps {
  logs: HabitLog[];
  loading: boolean;
}

export function CheckInHistory({ logs, loading }: CheckInHistoryProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    );
  }
  
  if (logs.length === 0) return <p className="text-sm text-gray-400">No check-ins yet.</p>;

  return (
    <ul className="flex flex-col gap-1.5" aria-label="Recent check-in history">
      {logs
        .slice()
        .reverse()
        .map((log) => (
          <li key={log.id} className="flex items-center gap-2.5 text-sm text-gray-600">
            <span className={log.completed ? "text-green-600" : "text-gray-400"}>
              {log.completed ? "✓" : "–"}
            </span>
            <span className="font-medium text-gray-700">{formatShortDate(log.date)}</span>
            {log.note && <span className="text-gray-400 italic">· {log.note}</span>}
          </li>
        ))}
    </ul>
  );
}
