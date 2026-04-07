/** Mirrors the GraphQL schema from habit-coach-api. */

export interface AuthPayload {
  accessToken: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  currentStreak: number;
}

export interface WeeklyStats {
  dates: string[];
  counts: number[];
}

export interface HabitWithWeeklyStats extends Habit {
  weeklyStats: WeeklyStats;
}

export interface HabitLog {
  id: string;
  habitId: string;
  /** UTC calendar date, format: YYYY-MM-DD */
  date: string;
  completed: boolean;
  note?: string | null;
}

// ---- Input types ----

export interface SignupInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
}

export interface ToggleHabitActiveInput {
  habitId: string;
  isActive: boolean;
}

export interface LogCheckInInput {
  habitId: string;
  date: string;
  note?: string;
}

export interface RemoveCheckInInput {
  habitId: string;
  date: string;
}
