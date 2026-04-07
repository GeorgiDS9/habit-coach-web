import { graphql as gql } from "./generated";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const SIGNUP_MUTATION = gql(`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      accessToken
    }
  }
`);

export const LOGIN_MUTATION = gql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`);

// ---------------------------------------------------------------------------
// Habits
// ---------------------------------------------------------------------------

export const HABITS_QUERY = gql(`
  query Habits {
    habits {
      id
      title
      description
      isActive
      createdAt
      currentStreak
    }
  }
`);

export const CREATE_HABIT_MUTATION = gql(`
  mutation CreateHabit($input: CreateHabitInput!) {
    createHabit(input: $input) {
      id
      title
      description
      isActive
      createdAt
      currentStreak
    }
  }
`);

export const TOGGLE_HABIT_ACTIVE_MUTATION = gql(`
  mutation ToggleHabitActive($input: ToggleHabitActiveInput!) {
    toggleHabitActive(input: $input) {
      id
      isActive
    }
  }
`);

// ---------------------------------------------------------------------------
// Check-ins
// ---------------------------------------------------------------------------

export const HABIT_LOGS_QUERY = gql(`
  query HabitLogs($habitId: ID!, $from: String!, $to: String!) {
    habitLogs(habitId: $habitId, from: $from, to: $to) {
      id
      habitId
      date
      completed
      note
    }
  }
`);

export const LOG_CHECK_IN_MUTATION = gql(`
  mutation LogCheckIn($input: LogCheckInInput!) {
    logCheckIn(input: $input) {
      id
      habitId
      date
      completed
      note
    }
  }
`);

export const REMOVE_CHECK_IN_MUTATION = gql(`
  mutation RemoveCheckIn($input: RemoveCheckInInput!) {
    removeCheckIn(input: $input)
  }
`);

// ---------------------------------------------------------------------------
// Dashboard — weekly stats per habit
// ---------------------------------------------------------------------------

export const HABIT_WEEKLY_STATS_QUERY = gql(`
  query HabitWeeklyStats($from: String!, $to: String!) {
    habits {
      id
      title
      isActive
      currentStreak
      weeklyStats(from: $from, to: $to) {
        dates
        counts
      }
    }
  }
`);
