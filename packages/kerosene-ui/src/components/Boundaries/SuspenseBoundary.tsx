/* eslint-disable import/no-extraneous-dependencies */

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import * as React from "react";
import { ErrorBoundary, type ErrorBoundaryProps } from "react-error-boundary";
import type { ErrorFallbackProps } from "./types";

export type SuspenseBoundaryProps = {
  children: React.ReactNode;
  loadingFallback: React.ReactNode;
} & ErrorFallbackProps;

/**
 * Utility component for managing loading and error states for Suspense components. Also integrates with React Query to
 * provide a QueryErrorResetBoundary.
 *
 * There are three mutually exclusive options for specifying an error fallback:
 * - `errorFallback` - JSX element
 * - `errorFallbackRender` - a function which takes `FallbackProps` and renders JSX
 * - `ErrorFallbackComponent` - a React component which takes `FallbackProps`
 *
 * @example
 * ```tsx
 * const SuspendingComponent = () => {
 *   const query: UseSuspensQueryResult<{ balance: number }> = useMySuspenseQuery();
 *   return (
 *     <p>
 *       Your balance:{" "}
 *       {new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(balance)}
 *     </p>
 *   );
 * };
 *
 * const MyComponent = () => (
 *   <SuspenseBoundary
 *     errorFallbackRender={({ resetErrorBoundary }) => (
 *       <>
 *         Something went wrong.{" "}
 *         <button type="button" onClick={resetErrorBoundary}>Try again</button>
 *       </>
 *     )}
 *     loadingFallback={<LoadingSpinner />}
 *   >
 *     <SuspendingComponent />
 *   </SuspenseBoundary>
 * );
 * ```
 *
 * @param props
 */
const SuspenseBoundary = ({
  children,
  errorFallback,
  errorFallbackRender,
  ErrorFallbackComponent,
  loadingFallback,
}: SuspenseBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          {...({
            fallback: errorFallback,
            fallbackRender: errorFallbackRender,
            FallbackComponent: ErrorFallbackComponent,
          } as ErrorBoundaryProps)}
          onReset={reset}
        >
          <React.Suspense fallback={loadingFallback}>{children}</React.Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default SuspenseBoundary;
