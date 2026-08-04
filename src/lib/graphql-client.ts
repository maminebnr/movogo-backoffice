import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloLink } from "@apollo/client/link";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

const customFetch =
  typeof window !== "undefined" ? window.fetch.bind(window) : fetch;

function clearAuthAndRedirect() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

function isSessionExpired(error: unknown): boolean {
  if (!CombinedGraphQLErrors.is(error)) return false;
  return error.errors.some((e) => {
    const code = (e.extensions as { code?: string } | undefined)?.code;
    const msg = (e.message || "").toLowerCase();
    // Do NOT treat login "Invalid credentials" (UNAUTHORIZED) as session expiry
    return (
      code === "FORBIDDEN" ||
      code === "UNAUTHENTICATED" ||
      msg.includes("not authenticated")
    );
  });
}

const errorLink = new ErrorLink(({ error }) => {
  if (isSessionExpired(error)) {
    clearAuthAndRedirect();
  }
});

const authLink = new ApolloLink((operation, forward) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const existingHeaders = operation.getContext().headers || {};

    operation.setContext({
      headers: {
        ...existingHeaders,
        authorization: token ? `Bearer ${token}` : "",
        "content-type": "application/json",
      },
    });

    return forward(operation);
  } catch (error) {
    console.error("Auth link error:", error);
    return forward(operation);
  }
});

const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_URL || "/api/graphql";

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: "same-origin",
  fetch: customFetch,
});

export function createApolloClient() {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}
