"use client";

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client/core";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ApolloProvider } from "@apollo/client/react";
import { useRef } from "react";
import { getToken, clearToken } from "@/lib/auth";

function makeClient(): ApolloClient {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
  });

  // SetContextLink is the v4 API (setContext is deprecated with flipped args)
  const authLink = new SetContextLink((prevContext) => {
    const token = getToken();
    return {
      headers: {
        ...prevContext["headers"],
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  // Clear token and reload to login when the server returns UNAUTHENTICATED.
  // Without this, Apollo caches the error and replays it on every refetch —
  // causing "Not authenticated" to persist even after navigation/refresh.
  const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      const isUnauthenticated = error.errors.some(
        (e) => e.extensions?.["code"] === "UNAUTHENTICATED"
      );
      if (isUnauthenticated) {
        clearToken();
        // Hard redirect — clears the Apollo cache (in-memory) entirely
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
      }
    }
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

export function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  const client = useRef<ApolloClient>(null);
  if (!client.current) {
    client.current = makeClient();
  }
  return <ApolloProvider client={client.current}>{children}</ApolloProvider>;
}
