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
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearTokens,
} from "@/lib/auth";
import { REFRESH_MUTATION } from "@/graphql/operations";

let isRefreshing = false;
let pendingRequests: ((token: string | null) => void)[] = [];

const resolvePendingRequests = (token: string | null) => {
  pendingRequests.map((callback) => callback(token));
  pendingRequests = [];
};

function makeClient(): ApolloClient<object> {
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

  const errorLink = new ErrorLink(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        const isUnauthenticated = graphQLErrors.some(
          (e) => e.extensions?.["code"] === "UNAUTHENTICATED"
        );

        if (isUnauthenticated) {
          if (!isRefreshing) {
            isRefreshing = true;
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
              isRefreshing = false;
              clearTokens();
              window.location.replace("/login");
              return;
            }

            // Create a temporary client to avoid recursive calls to this link
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
                  const refreshData = data as { refresh?: { accessToken: string; refreshToken: string } } | undefined;
                  const newAccess = refreshData?.refresh?.accessToken;
                  const newRefresh = refreshData?.refresh?.refreshToken;

                  if (newAccess && newRefresh) {
                    setToken(newAccess);
                    setRefreshToken(newRefresh);
                    resolvePendingRequests(newAccess);
                  } else {
                    throw new Error("Refresh failed");
                  }
                })
                .catch(() => {
                  resolvePendingRequests(null);
                  clearTokens();
                  window.location.replace("/login");
                })
                .finally(() => {
                  isRefreshing = false;
                })
                .then(() => {
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };
                  forward(operation).subscribe(subscriber);
                });
            });
          }

          return new Observable((observer) => {
            pendingRequests.push((token: string | null) => {
              if (token) {
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                  },
                }));
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              } else {
                observer.error(new Error("Token refresh failed"));
              }
            });
          });
        }
      }

      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    }
  );

  const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
      query: { fetchPolicy: "network-only" },
    },
  });

  return client;
}

export function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo(() => makeClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
