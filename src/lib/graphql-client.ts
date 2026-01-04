import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloLink } from "@apollo/client/link";

// Use fetch directly - if Chrome extension is causing issues, user should disable it
// or use incognito mode
const customFetch = typeof window !== "undefined" ? window.fetch.bind(window) : fetch;

// Create an auth link that adds the token to headers
const authLink = new ApolloLink((operation, forward) => {
  try {
    // Get the authentication token from localStorage if it exists
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    
    // Get existing headers
    const existingHeaders = operation.getContext().headers || {};
    
    // Add the authorization header
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

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://apimovogo.persistatechnology.com/graphql",
  credentials: "include",
  fetchOptions: {
    mode: "cors",
  },
  // Use the custom fetch to bypass extension interception
  fetch: customFetch,
});

export function createApolloClient() {
  return new ApolloClient({
    link: authLink.concat(httpLink),
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
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
}


