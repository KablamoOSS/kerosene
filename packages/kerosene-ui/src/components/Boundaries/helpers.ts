import type {
  DefinedQueryObserverResult,
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  UseQueryResult,
} from "@tanstack/react-query";

/**
 * Returns whether a given query has a defined result. This includes the success state of the query, as well as the
 * states for refetch in progress, as well as the refetch error state with stale data.
 * @param query React Query query
 */
export function isDefinedQueryObserverResult<TData = unknown, TError = unknown>(
  query: UseQueryResult<TData, TError>,
): query is DefinedQueryObserverResult<TData, TError> {
  return query.data !== undefined;
}

/**
 * Returns whether a given query is in the error state with no defined result. This includes the error state when data
 * is refetching.
 * @param query React Query query
 */
export function isQueryObserverLoadingErrorResult<
  TData = unknown,
  TError = unknown,
>(
  query: UseQueryResult<TData, TError>,
): query is QueryObserverLoadingErrorResult<TData, TError> {
  return query.data === undefined && query.isError;
}

/**
 * Returns whether a given query is in the loading state with no defined result. This includes the error state when data
 * is refetching.
 * @param query React Query query
 */
export function isQueryObserverLoadingResult<TData = unknown, TError = unknown>(
  query: UseQueryResult<TData, TError>,
): query is QueryObserverLoadingResult<TData, TError> {
  return query.data === undefined && query.isPending;
}
