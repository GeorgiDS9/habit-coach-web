/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.SignupDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Refresh($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.RefreshDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": typeof types.LogoutDocument,
    "\n  query Habits {\n    habits {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n": typeof types.HabitsDocument,
    "\n  mutation CreateHabit($input: CreateHabitInput!) {\n    createHabit(input: $input) {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n": typeof types.CreateHabitDocument,
    "\n  mutation ToggleHabitActive($input: ToggleHabitActiveInput!) {\n    toggleHabitActive(input: $input) {\n      id\n      isActive\n    }\n  }\n": typeof types.ToggleHabitActiveDocument,
    "\n  query HabitLogs($habitId: ID!, $from: String!, $to: String!) {\n    habitLogs(habitId: $habitId, from: $from, to: $to) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n": typeof types.HabitLogsDocument,
    "\n  mutation LogCheckIn($input: LogCheckInInput!) {\n    logCheckIn(input: $input) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n": typeof types.LogCheckInDocument,
    "\n  mutation RemoveCheckIn($input: RemoveCheckInInput!) {\n    removeCheckIn(input: $input)\n  }\n": typeof types.RemoveCheckInDocument,
    "\n  query HabitWeeklyStats($from: String!, $to: String!) {\n    habits {\n      id\n      title\n      isActive\n      currentStreak\n      weeklyStats(from: $from, to: $to) {\n        dates\n        counts\n      }\n    }\n  }\n": typeof types.HabitWeeklyStatsDocument,
};
const documents: Documents = {
    "\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.SignupDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Refresh($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.RefreshDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": types.LogoutDocument,
    "\n  query Habits {\n    habits {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n": types.HabitsDocument,
    "\n  mutation CreateHabit($input: CreateHabitInput!) {\n    createHabit(input: $input) {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n": types.CreateHabitDocument,
    "\n  mutation ToggleHabitActive($input: ToggleHabitActiveInput!) {\n    toggleHabitActive(input: $input) {\n      id\n      isActive\n    }\n  }\n": types.ToggleHabitActiveDocument,
    "\n  query HabitLogs($habitId: ID!, $from: String!, $to: String!) {\n    habitLogs(habitId: $habitId, from: $from, to: $to) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n": types.HabitLogsDocument,
    "\n  mutation LogCheckIn($input: LogCheckInInput!) {\n    logCheckIn(input: $input) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n": types.LogCheckInDocument,
    "\n  mutation RemoveCheckIn($input: RemoveCheckInInput!) {\n    removeCheckIn(input: $input)\n  }\n": types.RemoveCheckInDocument,
    "\n  query HabitWeeklyStats($from: String!, $to: String!) {\n    habits {\n      id\n      title\n      isActive\n      currentStreak\n      weeklyStats(from: $from, to: $to) {\n        dates\n        counts\n      }\n    }\n  }\n": types.HabitWeeklyStatsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Refresh($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Refresh($refreshToken: String!) {\n    refresh(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n"): (typeof documents)["\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Habits {\n    habits {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n"): (typeof documents)["\n  query Habits {\n    habits {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateHabit($input: CreateHabitInput!) {\n    createHabit(input: $input) {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n"): (typeof documents)["\n  mutation CreateHabit($input: CreateHabitInput!) {\n    createHabit(input: $input) {\n      id\n      title\n      description\n      isActive\n      createdAt\n      currentStreak\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ToggleHabitActive($input: ToggleHabitActiveInput!) {\n    toggleHabitActive(input: $input) {\n      id\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation ToggleHabitActive($input: ToggleHabitActiveInput!) {\n    toggleHabitActive(input: $input) {\n      id\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HabitLogs($habitId: ID!, $from: String!, $to: String!) {\n    habitLogs(habitId: $habitId, from: $from, to: $to) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n"): (typeof documents)["\n  query HabitLogs($habitId: ID!, $from: String!, $to: String!) {\n    habitLogs(habitId: $habitId, from: $from, to: $to) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogCheckIn($input: LogCheckInInput!) {\n    logCheckIn(input: $input) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n"): (typeof documents)["\n  mutation LogCheckIn($input: LogCheckInInput!) {\n    logCheckIn(input: $input) {\n      id\n      habitId\n      date\n      completed\n      note\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCheckIn($input: RemoveCheckInInput!) {\n    removeCheckIn(input: $input)\n  }\n"): (typeof documents)["\n  mutation RemoveCheckIn($input: RemoveCheckInInput!) {\n    removeCheckIn(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HabitWeeklyStats($from: String!, $to: String!) {\n    habits {\n      id\n      title\n      isActive\n      currentStreak\n      weeklyStats(from: $from, to: $to) {\n        dates\n        counts\n      }\n    }\n  }\n"): (typeof documents)["\n  query HabitWeeklyStats($from: String!, $to: String!) {\n    habits {\n      id\n      title\n      isActive\n      currentStreak\n      weeklyStats(from: $from, to: $to) {\n        dates\n        counts\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;