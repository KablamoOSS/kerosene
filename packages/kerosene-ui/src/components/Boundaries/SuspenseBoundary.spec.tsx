import { Deferred } from "@kablamo/kerosene";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { noop } from "lodash";
import * as React from "react";
import SuspenseBoundary from "./SuspenseBoundary";
import type { ErrorFallbackProps } from "./types";

const SuspendingComponent = <T extends NonNullable<React.ReactNode>>({
  queryFn,
}: {
  queryFn: () => Promise<T>;
}) => {
  const query = useSuspenseQuery({
    queryKey: ["SuspenseBoundary", "SuspendingComponent"],
    queryFn: () => queryFn(),
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{query.data}</>;
};

const error = new Error("an error");
const rejectedPromise = Promise.reject(error);
// A .catch() handler must be added synchronously to prevent PromiseRejectionUnhandledWarning
rejectedPromise.catch(noop);

describe("SuspenseBoundary", () => {
  it.each([
    {
      expected: "Success",
      value: "Success",
    },
    {
      errorFallbackProps: {
        errorFallback: <>errorFallback</>,
      },
      expected: "errorFallback",
      value: rejectedPromise,
    },
    {
      errorFallbackProps: {
        errorFallbackRender: jest
          .fn()
          .mockImplementation(() => <>errorFallbackRender</>),
      },
      expected: "errorFallbackRender",
      value: rejectedPromise,
    },
    {
      errorFallbackProps: {
        ErrorFallbackComponent: jest
          .fn()
          .mockImplementation(() => <>ErrorFallbackComponent</>),
      },
      expected: "ErrorFallbackComponent",
      value: rejectedPromise,
    },
  ] satisfies Array<{
    errorFallbackProps?: ErrorFallbackProps;
    expected: string;
    value: string | Promise<string>;
  }>)(
    "should render a loading state and then $expected",
    async ({
      errorFallbackProps = { errorFallback: <>Error</> },
      expected,
      value,
    }) => {
      const deferred = new Deferred<string>();
      render(
        <SuspenseBoundary loadingFallback="Loading" {...errorFallbackProps}>
          <SuspendingComponent queryFn={() => deferred.promise} />
        </SuspenseBoundary>,
        {
          wrapper({ children }) {
            return (
              <QueryClientProvider
                client={
                  new QueryClient({
                    defaultOptions: { queries: { retry: false } },
                  })
                }
              >
                {children}
              </QueryClientProvider>
            );
          },
        },
      );

      expect(screen.getByText("Loading")).toBeInTheDocument();

      deferred.resolve(value);
      await waitFor(() =>
        expect(screen.getByText(expected)).toBeInTheDocument(),
      );
      if (errorFallbackProps.errorFallbackRender) {
        expect(errorFallbackProps.errorFallbackRender).toHaveBeenCalledWith({
          error,
          resetErrorBoundary: expect.any(Function),
        });
      }
      if (errorFallbackProps.ErrorFallbackComponent) {
        expect(errorFallbackProps.ErrorFallbackComponent).toHaveBeenCalledWith(
          {
            error,
            resetErrorBoundary: expect.any(Function),
          },
          expect.anything(),
        );
      }
    },
  );
});
