/**
 * Apollo Client v4 removed the `ApolloError` class. Errors from hooks are
 * now typed as `unknown`. We duck-type the shapes we care about rather than
 * importing removed internals.
 */

/** Extension codes mirrored from habit-coach-api errorCodes. */
const FRIENDLY_MESSAGES: Record<string, string> = {
  UNAUTHENTICATED: "Your session has expired. Please log in again.",
  BAD_USER_INPUT: "Invalid input. Please check your details and try again.",
  NOT_FOUND: "The requested resource was not found.",
  FORBIDDEN: "You do not have permission to perform this action.",
};

interface GraphQLErrorLike {
  message?: string;
  extensions?: { code?: string };
}

interface ErrorWithCause {
  cause?: GraphQLErrorLike[] | unknown;
  message?: string;
}

/**
 * Extracts a user-friendly message from an Apollo v4 error (typed as unknown).
 * Never leaks internal stack traces or DB details.
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";

  const e = error as ErrorWithCause;

  // CombinedGraphQLErrors: has `cause` array of individual GraphQL errors
  if (Array.isArray(e.cause)) {
    const first = e.cause[0] as GraphQLErrorLike | undefined;
    if (first) {
      const code = first.extensions?.code;
      if (code && FRIENDLY_MESSAGES[code]) {
        return FRIENDLY_MESSAGES[code];
      }
      if (first.message && first.message.length < 200) {
        return first.message;
      }
    }
  }

  // Fallback: top-level message (e.g. network errors, LinkError)
  if (typeof e.message === "string" && e.message.length > 0 && e.message.length < 200) {
    if (e.message.toLowerCase().includes("failed to fetch") || e.message.toLowerCase().includes("network")) {
      return "Cannot reach the server. Please check your connection.";
    }
    return e.message;
  }

  return "An unexpected error occurred. Please try again.";
}
