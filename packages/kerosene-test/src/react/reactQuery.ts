/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DataTag,
  QueryKey,
  QueryObserverBaseResult,
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
} from "@tanstack/react-query";
import noop from "lodash/noop";

function createQueryObserverBaseResult<
  TData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = any[],
>(
  queryKey: TQueryKey = [] as unknown as TQueryKey,
): QueryObserverBaseResult<TData, TError> & {
  queryKey: DataTag<TQueryKey, TData>;
} {
  return {
    data: undefined,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isEnabled: false,
    isError: false,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPending: true,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: false,
    promise: new Promise<TData>(noop),
    refetch: jest.fn(),
    status: "pending",
    fetchStatus: "idle",
    queryKey: queryKey as DataTag<TQueryKey, TData>,
  };
}

export function createQueryObserverSuccessResult<
  TData,
  TError = never,
  TQueryKey extends QueryKey = any[],
>(
  data: TData,
  queryKey?: TQueryKey,
): QueryObserverSuccessResult<TData, TError> & {
  queryKey: DataTag<TQueryKey, TData>;
} {
  return {
    ...createQueryObserverBaseResult<TData, TError, TQueryKey>(queryKey),
    data,
    error: null,
    isEnabled: true,
    isError: false,
    isLoading: false,
    isLoadingError: false,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isSuccess: true,
    promise: Promise.resolve(data),
    status: "success",
  };
}

export function createQueryObserverRefetchErrorResult<
  TData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = any[],
>(
  data: TData,
  error: TError,
  queryKey?: TQueryKey,
): QueryObserverRefetchErrorResult<TData, TError> & {
  queryKey: DataTag<TQueryKey, TData>;
} {
  return {
    ...createQueryObserverBaseResult<TData, TError, TQueryKey>(queryKey),
    data,
    error,
    isEnabled: true,
    isError: true,
    isLoading: false,
    isLoadingError: false,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: true,
    isSuccess: false,
    status: "error",
  };
}

export function createQueryObserverLoadingErrorResult<
  TData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = any[],
>(
  error: TError,
  queryKey?: TQueryKey,
): QueryObserverLoadingErrorResult<TData, TError> & {
  queryKey: DataTag<TQueryKey, TData>;
} {
  return {
    ...createQueryObserverBaseResult<TData, TError, TQueryKey>(queryKey),
    data: undefined,
    error,
    isEnabled: true,
    isError: true,
    isLoading: false,
    isLoadingError: true,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isSuccess: false,
    status: "error",
  };
}

export function createQueryObserverLoadingResult<
  TData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = any[],
>(
  queryKey?: TQueryKey,
): QueryObserverLoadingResult<TData, TError> & {
  queryKey: DataTag<TQueryKey, TData>;
} {
  return {
    ...createQueryObserverBaseResult<TData, TError, TQueryKey>(queryKey),
    data: undefined,
    error: null,
    isEnabled: true,
    isError: false,
    isInitialLoading: true,
    isLoading: true,
    isLoadingError: false,
    isPending: true,
    isPlaceholderData: false,
    isRefetchError: false,
    isSuccess: false,
    status: "pending",
    fetchStatus: "fetching",
  };
}
