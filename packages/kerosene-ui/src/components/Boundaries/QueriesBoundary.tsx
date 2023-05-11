import type {
  QueryObserverSuccessResult,
  UseQueryResult,
} from "@tanstack/react-query";
import * as React from "react";
import type { FallbackProps } from "react-error-boundary";
import {
  isQueryObserverLoadingErrorResult,
  isQueryObserverLoadingResult,
} from "./helpers";
import type { ErrorFallbackProps } from "./types";

/**
 * Provides a type for the children function of `<QueriesBoundary queries={[query1, query2]} />`
 * that allows the types of a successful query to be inferred for ease of use
 * @example
 * ```ts
 * type C = ChildrenFn<readonly [
 *   UseQueryResult<Query1Data>,
 *   UseQueryResult<Query2Data>,
 * ]>;
 * // Equivalent to
 * type C = (queries: readonly [
 *   QueryObserverSuccessResult<Query1Data>,
 *   QueryObserverSuccessResult<Query2Data>,
 * ]) => React.ReactNode;
 * ```
 */
type ChildrenFn<TQueries extends ReadonlyArray<UseQueryResult>> = (queries: {
  [Key in keyof TQueries]: TQueries[Key] extends UseQueryResult<
    infer TData,
    infer TError
  >
    ? QueryObserverSuccessResult<TData, TError>
    : TQueries[Key];
}) => React.ReactNode;

export type QueriesBoundaryProps<
  TQueries extends ReadonlyArray<UseQueryResult>,
> = {
  children: React.ReactNode | ChildrenFn<TQueries>;
  loadingFallback: React.ReactNode;
  queries: TQueries;
} & ErrorFallbackProps;

export class AggregateQueriesError extends AggregateError {}

/**
 * Utility component for managing the loading and error states for multiple React Query queries. Specifying the queries
 * automatically infers the types of the success state of the queries in the render prop children (if used).
 *
 * There are three mutually exclusive options for specifying an error fallback:
 * - `errorFallback` - JSX element
 * - `errorFallbackRender` - a function which takes `FallbackProps` and renders JSX
 * - `ErrorFallbackComponent` - a React component which takes `FallbackProps`
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const query1: UseQueryResult<{ items: readonly string[] }> = useMyQuery1();
 *   const query2: UseQueryResult<{ balance: number }> = useMyQuery2();
 *
 *   return (
 *     <QueriesBoundary
 *       errorFallbackRender={({ resetErrorBoundary }) => (
 *         <>
 *           Something went wrong.{" "}
 *           <button type="button" onClick={resetErrorBoundary}>Try again</button>
 *         </>
 *       )}
 *       loadingFallback={<SkeletonComponent />}
 *       queries={[query1, query2]}
 *     >
 *       {([{ data: { items } }, { data: { balance } }]) => (
 *         <>
 *           <p>
 *             Your balance:{" "}
 *             {new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(balance)}
 *           </p>
 *           <p>
 *             You have:{" "}
 *             {new Intl.ListFormat("en", { style: "long", type: "conunction" }).format(data.items)}
 *           </p>
 *         </>
 *       )}
 *     </QueryBoundary>
 *   );
 * };
 * ```
 *
 * @param props
 */
const QueriesBoundary = <
  // Including a newline here to fix broken syntax highlighting
  const TQueries extends ReadonlyArray<UseQueryResult>,
>({
  children,
  errorFallback,
  errorFallbackRender,
  ErrorFallbackComponent,
  loadingFallback,
  queries,
}: QueriesBoundaryProps<TQueries>): JSX.Element => {
  /**
   * If any of the queries are in the error state, combine them into a single `AggregateError`
   */
  const error = React.useMemo(() => {
    const errors = queries
      .filter(isQueryObserverLoadingErrorResult)
      .map((query) => query.error);
    return errors.length
      ? new AggregateQueriesError(
          errors,
          "One or more queries are in the LoadingErrorResult state:",
        )
      : undefined;
  }, [queries]);

  /**
   * If any of the queries have a status of `"error"`, this will trigger a refetch of each
   */
  const resetErrorBoundary = React.useCallback(
    () =>
      queries
        .filter(
          (query): query is Extract<typeof query, { status: "error" }> =>
            query.status === "error",
        )
        .forEach((query) => void query.refetch()),
    [queries],
  );

  if (queries.some((query) => isQueryObserverLoadingResult(query))) {
    return <>{loadingFallback}</>;
  }

  if (error) {
    if (React.isValidElement(errorFallback)) {
      return <>{errorFallback}</>;
    }

    const errorFallbackProps: FallbackProps = {
      error,
      resetErrorBoundary,
    };

    if (typeof errorFallbackRender === "function") {
      return <>{errorFallbackRender(errorFallbackProps)}</>;
    }

    if (ErrorFallbackComponent) {
      return <ErrorFallbackComponent {...errorFallbackProps} />;
    }

    /* istanbul ignore next */
    throw new Error(
      "QueriesBoundary requires either errorFallback, errorFallbackRender, or ErrorFallbackComponent prop",
    );
  }

  return (
    <>
      {typeof children === "function"
        ? children(queries as Parameters<ChildrenFn<TQueries>>[0])
        : children}
    </>
  );
};

export default QueriesBoundary;
