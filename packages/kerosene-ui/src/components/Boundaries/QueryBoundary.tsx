import type {
  DefinedQueryObserverResult,
  UseQueryResult,
} from "@tanstack/react-query";
import * as React from "react";
import type { FallbackProps } from "react-error-boundary";
import { isDefinedQueryObserverResult } from "./helpers";
import type { ErrorFallbackProps } from "./types";

export type QueryBoundaryProps<TData = unknown, TError = unknown> = {
  children:
    | React.ReactNode
    | ((query: DefinedQueryObserverResult<TData, TError>) => React.ReactNode);
  loadingFallback: React.ReactNode;
  query: UseQueryResult<TData, TError>;
} & ErrorFallbackProps;

/**
 * Utility component for managing the loading and error states for a single React Query query. Specifying the query
 * automatically infers the type of the success state of the query in the render prop children (if used).
 *
 * There are three mutually exclusive options for specifying an error fallback:
 * - `errorFallback` - JSX element
 * - `errorFallbackRender` - a function which takes `FallbackProps` and renders JSX
 * - `ErrorFallbackComponent` - a React component which takes `FallbackProps`
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const query: UseQueryResult<{ items: readonly string[] }> = useMyQuery();
 *   return (
 *     <QueryBoundary
 *       errorFallbackRender={({ resetErrorBoundary }) => (
 *         <>
 *           Something went wrong.{" "}
 *           <button type="button" onClick={resetErrorBoundary}>Try again</button>
 *         </>
 *       )}
 *       loadingFallback={<LoadingSpinner />}
 *       query={query}
 *     >
 *       {({ data }) => (
 *         <p>
 *           You have:{" "}
 *           {new Intl.ListFormat("en", { style: "long", type: "conunction" }).format(data.items)}
 *         </p>
 *       )}
 *     </QueryBoundary>
 *   );
 * };
 * ```
 *
 * @param props
 */
const QueryBoundary = <
  // Including a newline here to fix broken syntax highlighting
  TData = unknown,
  TError = unknown,
>({
  children,
  errorFallback,
  errorFallbackRender,
  ErrorFallbackComponent,
  loadingFallback,
  query,
}: QueryBoundaryProps<TData, TError>): JSX.Element => {
  const { refetch } = query;
  const resetErrorBoundary = React.useCallback(() => {
    void refetch();
  }, [refetch]);

  // A "defined" result means that we have usable data
  if (isDefinedQueryObserverResult(query)) {
    return <>{typeof children === "function" ? children(query) : children}</>;
  }

  if (query.isLoading) {
    return <>{loadingFallback}</>;
  }

  if (React.isValidElement(errorFallback)) {
    return <>{errorFallback}</>;
  }

  const errorFallbackProps: FallbackProps = {
    error: query.error,
    resetErrorBoundary,
  };

  if (typeof errorFallbackRender === "function") {
    return <>{errorFallbackRender(errorFallbackProps)}</>;
  }

  if (ErrorFallbackComponent) {
    return <ErrorFallbackComponent {...errorFallbackProps} />;
  }

  throw new Error(
    "QueryBoundary requires either errorFallback, errorFallbackRender, or ErrorFallbackComponent prop",
  );
};

export default QueryBoundary;
