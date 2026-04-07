"use client";

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { useRef } from "react";
import { getToken } from "@/lib/auth";

function makeClient(): ApolloClient {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: "all" },
      query: { errorPolicy: "all" },
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
