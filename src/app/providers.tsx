"use client";
import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@/lib/graphql-client";
import { AuthProvider } from "@/lib/auth-context";

const client = createApolloClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthProvider>
  );
}


