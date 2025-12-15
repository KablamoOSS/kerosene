// @vitest-environment jsdom

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
      props: {
        errorFallback: <>errorFallback</>,
      },
      expected: "errorFallback",
      value: rejectedPromise,
    },
    {
      props: {
        errorFallbackRender: vi
          .fn()
          .mockImplementation(() => <>errorFallbackRender</>),
      },
      expected: "errorFallbackRender",
      value: rejectedPromise,
    },
    {
      props: {
        ErrorFallbackComponent: vi
          .fn()
          .mockImplementation(() => <>ErrorFallbackComponent</>),
      },
      expected: "ErrorFallbackComponent",
      value: rejectedPromise,
    },
  ] satisfies Array<{
    props?: ErrorFallbackProps;
    expected: string;
    value: string | Promise<string>;
  }>)(
    "should render a loading state and then $expected",
    async ({ props = { errorFallback: <>Error</> }, expected, value }) => {
      const deferred = Promise.withResolvers<string>();
      render(
        <SuspenseBoundary loadingFallback="Loading" {...props}>
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
      if (props.errorFallbackRender) {
        expect(props.errorFallbackRender).toHaveBeenCalledWith({
          error,
          resetErrorBoundary: expect.any(Function),
        });
      }
      if (props.ErrorFallbackComponent) {
        expect(props.ErrorFallbackComponent).toHaveBeenCalledWith(
          {
            error,
            resetErrorBoundary: expect.any(Function),
          },
          undefined,
        );
      }
    },
  );
});
