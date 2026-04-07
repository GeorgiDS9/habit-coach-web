/** Returns today's UTC date as YYYY-MM-DD. */
export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Returns the date N days ago (UTC) as YYYY-MM-DD. */
export function daysAgoUTC(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Formats a YYYY-MM-DD string to a short human-readable label (e.g. "Mon 7"). */
export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
