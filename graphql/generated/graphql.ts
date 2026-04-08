/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type CreateHabitInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Habit = {
  __typename?: 'Habit';
  createdAt: Scalars['String']['output'];
  /**
   * Number of consecutive days with completed=true ending at or including
   * today (UTC). Streak stays "live" if the most recent completed day is
   * yesterday.
   */
  currentStreak: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  /**
   * Daily completion breakdown for an inclusive UTC date range.
   * Dates must be in YYYY-MM-DD format.
   */
  weeklyStats: WeeklyStats;
};


export type HabitWeeklyStatsArgs = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};

/**
 * One check-in record. Dates are UTC calendar dates returned as YYYY-MM-DD
 * strings. One log per habit per UTC calendar day (enforced by DB unique
 * constraint on (habitId, date)).
 */
export type HabitLog = {
  __typename?: 'HabitLog';
  completed: Scalars['Boolean']['output'];
  /**  UTC calendar date, format: YYYY-MM-DD  */
  date: Scalars['String']['output'];
  habitId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
};

/**
 * Upserts a check-in for the given habit on the given UTC calendar day.
 * One log per (habitId, date) — subsequent calls for the same pair update the
 * existing record.
 */
export type LogCheckInInput = {
  /**  UTC calendar date, format: YYYY-MM-DD  */
  date: Scalars['String']['input'];
  habitId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createHabit: Habit;
  /**  Upsert a daily check-in. Habit must belong to the authenticated user.  */
  logCheckIn: HabitLog;
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  refresh: AuthPayload;
  /**  Remove a daily check-in. Habit must belong to the authenticated user.  */
  removeCheckIn: Scalars['Boolean']['output'];
  signup: AuthPayload;
  toggleHabitActive: Habit;
};


export type MutationCreateHabitArgs = {
  input: CreateHabitInput;
};


export type MutationLogCheckInArgs = {
  input: LogCheckInInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRemoveCheckInArgs = {
  input: RemoveCheckInInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationToggleHabitActiveArgs = {
  input: ToggleHabitActiveInput;
};

export type Query = {
  __typename?: 'Query';
  /**
   * Returns HabitLog records for a habit in the inclusive UTC date range
   * [from, to]. The habit must belong to the authenticated user.
   * Dates must be in YYYY-MM-DD format.
   */
  habitLogs: Array<HabitLog>;
  habits: Array<Habit>;
  ping: Scalars['String']['output'];
};


export type QueryHabitLogsArgs = {
  from: Scalars['String']['input'];
  habitId: Scalars['ID']['input'];
  to: Scalars['String']['input'];
};

/**  Removes the check-in for a specific habit on a specific UTC calendar day.  */
export type RemoveCheckInInput = {
  /**  UTC calendar date, format: YYYY-MM-DD  */
  date: Scalars['String']['input'];
  habitId: Scalars['ID']['input'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ToggleHabitActiveInput = {
  habitId: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
};

/**
 * Daily breakdown for a date range — friendly shape for heatmap / bar chart.
 * dates[i] and counts[i] correspond to the same calendar day.
 */
export type WeeklyStats = {
  __typename?: 'WeeklyStats';
  /**  1 if the habit was completed on that day, 0 otherwise  */
  counts: Array<Scalars['Int']['output']>;
  /**  Ascending UTC dates in the requested range (YYYY-MM-DD)  */
  dates: Array<Scalars['String']['output']>;
};

export type SignupMutationVariables = Exact<{
  input: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string } };

export type RefreshMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type HabitsQueryVariables = Exact<{ [key: string]: never; }>;


export type HabitsQuery = { __typename?: 'Query', habits: Array<{ __typename?: 'Habit', id: string, title: string, description?: string | null, isActive: boolean, createdAt: string, currentStreak: number }> };

export type CreateHabitMutationVariables = Exact<{
  input: CreateHabitInput;
}>;


export type CreateHabitMutation = { __typename?: 'Mutation', createHabit: { __typename?: 'Habit', id: string, title: string, description?: string | null, isActive: boolean, createdAt: string, currentStreak: number } };

export type ToggleHabitActiveMutationVariables = Exact<{
  input: ToggleHabitActiveInput;
}>;


export type ToggleHabitActiveMutation = { __typename?: 'Mutation', toggleHabitActive: { __typename?: 'Habit', id: string, isActive: boolean } };

export type HabitLogsQueryVariables = Exact<{
  habitId: Scalars['ID']['input'];
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
}>;


export type HabitLogsQuery = { __typename?: 'Query', habitLogs: Array<{ __typename?: 'HabitLog', id: string, habitId: string, date: string, completed: boolean, note?: string | null }> };

export type LogCheckInMutationVariables = Exact<{
  input: LogCheckInInput;
}>;


export type LogCheckInMutation = { __typename?: 'Mutation', logCheckIn: { __typename?: 'HabitLog', id: string, habitId: string, date: string, completed: boolean, note?: string | null } };

export type RemoveCheckInMutationVariables = Exact<{
  input: RemoveCheckInInput;
}>;


export type RemoveCheckInMutation = { __typename?: 'Mutation', removeCheckIn: boolean };

export type HabitWeeklyStatsQueryVariables = Exact<{
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
}>;


export type HabitWeeklyStatsQuery = { __typename?: 'Query', habits: Array<{ __typename?: 'Habit', id: string, title: string, isActive: boolean, currentStreak: number, weeklyStats: { __typename?: 'WeeklyStats', dates: Array<string>, counts: Array<number> } }> };


export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const HabitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Habits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"habits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"currentStreak"}}]}}]}}]} as unknown as DocumentNode<HabitsQuery, HabitsQueryVariables>;
export const CreateHabitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateHabit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateHabitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createHabit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"currentStreak"}}]}}]}}]} as unknown as DocumentNode<CreateHabitMutation, CreateHabitMutationVariables>;
export const ToggleHabitActiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleHabitActive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ToggleHabitActiveInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleHabitActive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<ToggleHabitActiveMutation, ToggleHabitActiveMutationVariables>;
export const HabitLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HabitLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"habitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"habitLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"habitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"habitId"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"habitId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<HabitLogsQuery, HabitLogsQueryVariables>;
export const LogCheckInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogCheckIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogCheckInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logCheckIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"habitId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<LogCheckInMutation, LogCheckInMutationVariables>;
export const RemoveCheckInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCheckIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveCheckInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCheckIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RemoveCheckInMutation, RemoveCheckInMutationVariables>;
export const HabitWeeklyStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HabitWeeklyStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"habits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"currentStreak"}},{"kind":"Field","name":{"kind":"Name","value":"weeklyStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dates"}},{"kind":"Field","name":{"kind":"Name","value":"counts"}}]}}]}}]}}]} as unknown as DocumentNode<HabitWeeklyStatsQuery, HabitWeeklyStatsQueryVariables>;