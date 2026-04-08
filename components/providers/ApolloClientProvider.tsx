"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  Observable,
} from "@apollo/client/core";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { ApolloProvider } from "@apollo/client/react";
import { useMemo } from "react";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearTokens,
} from "@/lib/auth";
import { REFRESH_MUTATION } from "@/graphql/operations";

interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
  };
}

// Module-level state: only one refresh in flight at a time.
// Pending requests queue waits for the refresh to complete.
let isRefreshing = false;
let pendingRequests: ((token: string | null) => void)[] = [];

const resolvePendingRequests = (token: string | null) => {
  pendingRequests.map((callback) => callback(token));
  pendingRequests = [];
};

/**
 * Redirect to login, optionally with a reason code stored in sessionStorage
 * so the login page can surface a friendly message.
 */
function redirectToLogin(reason?: "expired"): void {
  if (typeof window === "undefined") return;
  if (reason) {
    sessionStorage.setItem("hc_session_reason", reason);
  }
  window.location.replace("/login");
}

function makeClient(): ApolloClient {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
  });

  const authLink = new SetContextLink((prevContext) => {
    const token = getToken();
    return {
      headers: {
        ...prevContext["headers"],
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const errorLink = new ErrorLink((errorLinkOptions) => {
    const { error, operation, forward } = errorLinkOptions;

    if (!CombinedGraphQLErrors.is(error)) {
      // Log network / server errors but don't intercept them.
      if (ServerError.is(error)) {
        console.error(`[Network error]: ${error.message} (status: ${error.statusCode})`);
      } else if (error) {
        console.error(`[Network error]: ${error}`);
      }
      return;
    }

    const isUnauthenticated = error.errors.some(
      (e: GraphQLError) => e.extensions?.["code"] === "UNAUTHENTICATED"
    );

    if (!isUnauthenticated) return;

    // -----------------------------------------------------------------------
    // No refresh already in flight — start one.
    // -----------------------------------------------------------------------
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token stored — can't recover, send to login.
        isRefreshing = false;
        clearTokens();
        redirectToLogin("expired");
        return;
      }

      // Use a bare client so this call bypasses the error link and avoids
      // an infinite retry loop.
      const refreshClient = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
      });

      return new Observable((observer) => {
        refreshClient
          .mutate({
            mutation: REFRESH_MUTATION,
            variables: { refreshToken },
          })
          .then(({ data }) => {
            const refreshData = data as
              | { refresh?: { accessToken: string; refreshToken: string } }
              | undefined;
            const newAccess = refreshData?.refresh?.accessToken;
            const newRefresh = refreshData?.refresh?.refreshToken;

            if (!newAccess || !newRefresh) {
              throw new Error("Refresh returned empty tokens");
            }

            setToken(newAccess);
            setRefreshToken(newRefresh);

            // Inject the new token into this operation's request context
            // so it goes out with the correct header on retry.
            operation.setContext(
              ({ headers = {} }: { headers: Record<string, string> }) => ({
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newAccess}`,
                },
              })
            );

            resolvePendingRequests(newAccess);
            isRefreshing = false;

            // Retry the original failed operation with the new token.
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(() => {
            // Refresh failed — session is dead; clean up and kick to login.
            isRefreshing = false;
            resolvePendingRequests(null);
            clearTokens();
            redirectToLogin("expired");
            observer.error(new Error("Session expired. Please log in again."));
          });
      });
    }

    // -----------------------------------------------------------------------
    // A refresh is already in flight — queue this request until it resolves.
    // -----------------------------------------------------------------------
    return new Observable((observer) => {
      pendingRequests.push((token: string | null) => {
        if (token) {
          operation.setContext(
            ({ headers = {} }: { headers: Record<string, string> }) => ({
              headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
              },
            })
          );
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        } else {
          observer.error(new Error("Token refresh failed"));
        }
      });
    });
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
      query: { fetchPolicy: "network-only" },
    },
  });
}

export function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo(() => makeClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
