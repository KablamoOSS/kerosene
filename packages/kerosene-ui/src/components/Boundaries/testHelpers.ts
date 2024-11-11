import type {
  QueryObserverBaseResult,
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
} from "@tanstack/react-query";
import { noop } from "lodash";

function createQueryObserverBaseResult<
  TData = unknown,
  TError = unknown,
>(): QueryObserverBaseResult<TData, TError> {
  return {
    data: undefined,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
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
  };
}

export function createQueryObserverSuccessResult<TData, TError = never>(
  data: TData,
): QueryObserverSuccessResult<TData, TError> {
  return {
    ...createQueryObserverBaseResult<TData, TError>(),
    data,
    error: null,
    isError: false,
    isLoading: false,
    isLoadingError: false,
    isPending: false,
    isRefetchError: false,
    isSuccess: true,
    promise: Promise.resolve(data),
    status: "success",
  };
}

export function createQueryObserverRefetchErrorResult<
  TData = unknown,
  TError = unknown,
>(data: TData, error: TError): QueryObserverRefetchErrorResult<TData, TError> {
  return {
    ...createQueryObserverBaseResult<TData, TError>(),
    data,
    error,
    isError: true,
    isLoading: false,
    isLoadingError: false,
    isPending: false,
    isRefetchError: true,
    isSuccess: false,
    status: "error",
  };
}

export function createQueryObserverLoadingErrorResult<
  TData = unknown,
  TError = unknown,
>(error: TError): QueryObserverLoadingErrorResult<TData, TError> {
  return {
    ...createQueryObserverBaseResult<TData, TError>(),
    data: undefined,
    error,
    isError: true,
    isLoading: false,
    isLoadingError: true,
    isPending: false,
    isRefetchError: false,
    isSuccess: false,
    status: "error",
  };
}

export function createQueryObserverLoadingResult<
  TData = unknown,
  TError = unknown,
>(): QueryObserverLoadingResult<TData, TError> {
  return {
    ...createQueryObserverBaseResult<TData, TError>(),
    data: undefined,
    error: null,
    isError: false,
    isInitialLoading: true,
    isLoading: true,
    isLoadingError: false,
    isPending: true,
    isRefetchError: false,
    isSuccess: false,
    status: "pending",
    fetchStatus: "fetching",
  };
}
