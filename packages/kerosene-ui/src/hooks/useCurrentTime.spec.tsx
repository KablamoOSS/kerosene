// @vitest-environment jsdom

import { MINUTE, SECOND, waitForEventLoopToDrain } from "@kablamo/kerosene";
import { act, renderHook } from "@testing-library/react";
import { identity } from "lodash";
import * as React from "react";
import type { Mock } from "vitest";
import useCurrentTime, { CurrentTimeProvider } from "./useCurrentTime";

const tick = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("useCurrentTime", () => {
  let documentHidden: Mock<() => boolean>;
  beforeEach(() => {
    vi.useFakeTimers();
    documentHidden = vi.spyOn(document, "hidden", "get");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should return the current time and update every minute", () => {
    const utils = renderHook(() => useCurrentTime());
    expect(utils.result.current).toBe(Date.now());

    tick(MINUTE);
    expect(utils.result.current).toBe(Date.now());
  });

  it("should update at the interval supplied", () => {
    const utils = renderHook(() => useCurrentTime(SECOND));
    expect(utils.result.current).toBe(Date.now());

    tick(SECOND);
    expect(utils.result.current).toBe(Date.now());
  });

  it("should not update when not visible", () => {
    const utils1 = renderHook(() => useCurrentTime());
    const utils2 = renderHook(() => useCurrentTime());
    expect(utils1.result.current).toBe(Date.now());
    expect(utils2.result.current).toBe(Date.now());
    documentHidden.mockReturnValue(true);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    tick(MINUTE);
    expect(utils1.result.current).not.toBe(Date.now());
    expect(utils2.result.current).not.toBe(Date.now());

    documentHidden.mockReturnValue(false);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(utils1.result.current).toBe(Date.now());
    expect(utils2.result.current).toBe(Date.now());
  });

  it("should emit events at the smallest period", async () => {
    const utils1 = renderHook(() => useCurrentTime());
    const utils2 = renderHook(() => useCurrentTime(SECOND));

    tick(SECOND);
    expect(utils1.result.current).not.toBe(Date.now());
    expect(utils2.result.current).toBe(Date.now());

    utils2.unmount();
    await act(waitForEventLoopToDrain);
    expect(utils1.result.current).toBe(Date.now());
  });

  it("should override defaults with context", () => {
    const ssrTime = new Date("2000-01-01T01:23:45.678Z").getTime();
    const useHistory: Mock<(value: number) => number> = vi
      .fn()
      .mockImplementation(identity);
    const utils = renderHook(() => useHistory(useCurrentTime()), {
      hydrate: true,
      wrapper: ({ children }) => (
        <CurrentTimeProvider defaultPeriod={10 * SECOND} ssrTime={ssrTime}>
          {children}
        </CurrentTimeProvider>
      ),
    });
    expect(useHistory).toHaveBeenCalledWith(ssrTime);
    expect(utils.result.current).toBe(Date.now());

    tick(10 * SECOND);
    expect(utils.result.current).toBe(Date.now());
  });
});
