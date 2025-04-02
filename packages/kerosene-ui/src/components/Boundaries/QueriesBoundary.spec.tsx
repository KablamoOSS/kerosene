import { Deferred, type DistributiveOmit } from "@kablamo/kerosene";
import { createQueryObserverLoadingErrorResult } from "@kablamo/kerosene-test";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash";
import * as React from "react";
import type { FallbackProps } from "react-error-boundary";
import QueriesBoundary, {
  AggregateQueriesError,
  type QueriesBoundaryProps,
} from "./QueriesBoundary";

const error = new Error("an error");
const rejectedPromise = Promise.reject(error);
// A .catch() handler must be added synchronously to prevent PromiseRejectionUnhandledWarning
rejectedPromise.catch(noop);

const pendingPromise = new Promise<never>(noop);

describe("QueriesBoundary", () => {
  it.each([
    {
      expected: "Success",
      props: {
        children: "Success",
        errorFallback: <>errorFallback</>,
      },
      value1: "data1",
      value2: "data2",
    },
    {
      expected: "data1,data2",
      props: {
        children: ([{ data: data1 }, { data: data2 }]) => (
          <>
            {data1},{data2}
          </>
        ),
        errorFallback: <>errorFallback</>,
      },
      value1: "data1",
      value2: "data2",
    },
    {
      expected: "errorFallback",
      props: {
        children: "Success",
        errorFallback: <>errorFallback</>,
      },
      value1: rejectedPromise,
      value2: rejectedPromise,
    },
    {
      expected: "errorFallbackRender",
      props: {
        children: "Success",
        errorFallbackRender: jest
          .fn()
          .mockImplementation(({ resetErrorBoundary }: FallbackProps) => (
            <button type="button" onClick={resetErrorBoundary}>
              errorFallbackRender
            </button>
          )),
      },
      value1: rejectedPromise,
      value2: rejectedPromise,
    },
    {
      expected: "ErrorFallbackComponent",
      props: {
        children: "Success",
        ErrorFallbackComponent: jest
          .fn()
          .mockImplementation(({ resetErrorBoundary }: FallbackProps) => (
            <button type="button" onClick={resetErrorBoundary}>
              ErrorFallbackComponent
            </button>
          )),
      },
      value1: rejectedPromise,
      value2: rejectedPromise,
    },
    {
      expected: "errorFallback",
      props: {
        children: "Success",
        errorFallback: <>errorFallback</>,
      },
      value1: rejectedPromise,
      value2: pendingPromise,
    },
  ] satisfies Array<{
    expected: string;
    props: DistributiveOmit<
      QueriesBoundaryProps<
        readonly [UseQueryResult<string>, UseQueryResult<string>]
      >,
      "queries" | "loadingFallback"
    >;
    value1: string | Promise<string>;
    value2: string | Promise<string>;
  }>)(
    "should render a loading state and then $expected",
    async ({ expected, props, value1, value2 }) => {
      let deferred1 = new Deferred<string>();
      let deferred2 = new Deferred<string>();
      const Component = () => {
        const query1 = useQuery({
          queryKey: ["QueriesBoundary", "Component", "query1"],
          queryFn: () => deferred1.promise,
        });
        const query2 = useQuery({
          queryKey: ["QueriesBoundary", "Component", "query2"],
          queryFn: () => deferred2.promise,
        });
        return (
          <QueriesBoundary
            {...props}
            queries={[query1, query2]}
            loadingFallback="Loading"
          />
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

      deferred1.resolve(value1);
      deferred2.resolve(value2);
      await waitFor(() =>
        expect(screen.getByText(expected)).toBeInTheDocument(),
      );
      if (props.errorFallbackRender) {
        expect(props.errorFallbackRender).toHaveBeenCalledWith({
          error: expect.any(AggregateQueriesError),
          resetErrorBoundary: expect.any(Function),
        });
      }

      if (props.ErrorFallbackComponent) {
        expect(props.ErrorFallbackComponent).toHaveBeenCalledWith(
          {
            error: expect.any(AggregateQueriesError),
            resetErrorBoundary: expect.any(Function),
          },
          undefined,
        );
      }

      if (props.errorFallbackRender || props.ErrorFallbackComponent) {
        deferred1 = new Deferred<string>();
        deferred2 = new Deferred<string>();
        void userEvent.click(screen.getByRole("button"));
        await waitFor(() =>
          expect(screen.getByText("Loading")).toBeInTheDocument(),
        );
      }
    },
  );

  it("should throw if no error fallback is provided", () => {
    const queries = [
      createQueryObserverLoadingErrorResult(new Error("an error")),
    ];
    expect(() =>
      render(
        // @ts-expect-error Testing error scenario with no error fallback
        <QueriesBoundary loadingFallback="loading" queries={queries}>
          children
        </QueriesBoundary>,
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
      "QueriesBoundary requires either errorFallback, errorFallbackRender, or ErrorFallbackComponent prop",
    );
  });
});
