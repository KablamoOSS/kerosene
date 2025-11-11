// @vitest-environment jsdom

import type { DistributiveOmit } from "@kablamo/kerosene";
import { createQueryObserverLoadingErrorResult } from "@kablamo/kerosene-test";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import noop from "lodash/noop";
import type { FallbackProps } from "react-error-boundary";
import QueryBoundary, { type QueryBoundaryProps } from "./QueryBoundary";

const error = new Error("an error");
const rejectedPromise = Promise.reject(error);
// A .catch() handler must be added synchronously to prevent PromiseRejectionUnhandledWarning
rejectedPromise.catch(noop);

describe("QueryBoundary", () => {
  it.each([
    {
      expected: "Success",
      props: {
        children: "Success",
        errorFallback: <>errorFallback</>,
      },
      value: "data",
    },
    {
      expected: "data",
      props: {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        children: ({ data }) => <>{data as string}</>,
        errorFallback: <>errorFallback</>,
      },
      value: "data",
    },
    {
      expected: "errorFallback",
      props: {
        children: "Success",
        errorFallback: <>errorFallback</>,
      },
      value: rejectedPromise,
    },
    {
      expected: "errorFallbackRender",
      props: {
        children: "Success",
        errorFallbackRender: vi
          .fn()
          .mockImplementation(({ resetErrorBoundary }: FallbackProps) => (
            <button type="button" onClick={resetErrorBoundary}>
              errorFallbackRender
            </button>
          )),
      },
      value: rejectedPromise,
    },
    {
      expected: "ErrorFallbackComponent",
      props: {
        children: "Success",
        ErrorFallbackComponent: vi
          .fn()
          .mockImplementation(({ resetErrorBoundary }: FallbackProps) => (
            <button type="button" onClick={resetErrorBoundary}>
              ErrorFallbackComponent
            </button>
          )),
      },
      value: rejectedPromise,
    },
  ] satisfies Array<{
    expected: string;
    props: DistributiveOmit<QueryBoundaryProps, "query" | "loadingFallback">;
    value: string | Promise<string>;
  }>)(
    "should render a loading state and then $expected",
    async ({ expected, props, value }) => {
      let deferred = Promise.withResolvers<string>();
      const Component = () => {
        const query = useQuery({
          queryKey: ["QueryBoundary", "Component"],
          queryFn: () => deferred.promise,
        });
        return (
          <QueryBoundary {...props} query={query} loadingFallback="Loading" />
        );
      };
      render(<Component />, {
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
      });

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

      if (props.errorFallbackRender || props.ErrorFallbackComponent) {
        deferred = Promise.withResolvers<string>();
        void userEvent.click(screen.getByRole("button"));
        await waitFor(() =>
          expect(screen.getByText("Loading")).toBeInTheDocument(),
        );
      }
    },
  );

  it("should throw if no error fallback is provided", () => {
    const query = createQueryObserverLoadingErrorResult(new Error("an error"));
    expect(() =>
      render(
        // @ts-expect-error Testing error scenario with no error fallback
        <QueryBoundary loadingFallback="loading" query={query}>
          children
        </QueryBoundary>,
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
      ),
    ).toThrow(
      "QueryBoundary requires either errorFallback, errorFallbackRender, or ErrorFallbackComponent prop",
    );
  });
});
