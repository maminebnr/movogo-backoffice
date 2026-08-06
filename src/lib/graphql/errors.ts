import { FetchResult } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

/** Extract first GraphQL error message from a mutation/query result. */
export function getGraphQLErrorMessage(
  result: FetchResult<unknown> | undefined,
): string | null {
  if (!result) return null;
  if (CombinedGraphQLErrors.is(result)) {
    return result.errors[0]?.message ?? "Request failed";
  }
  const errors = (result as { errors?: { message?: string }[] }).errors;
  if (errors?.length) {
    return errors[0]?.message ?? "Request failed";
  }
  return null;
}

/** Throws when the GraphQL response contains errors (needed with errorPolicy: all). */
export function assertNoGraphQLErrors(result: FetchResult<unknown> | undefined) {
  const message = getGraphQLErrorMessage(result);
  if (message) throw new Error(message);
}
