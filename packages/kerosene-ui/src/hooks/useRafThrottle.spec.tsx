// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import type { Mock, MockedFunction } from "vitest";
import _rafThrottle from "../utils/rafThrottle";
import useRafThrottle from "./useRafThrottle";

vi.mock("../utils/rafThrottle");

const rafThrottle = _rafThrottle as MockedFunction<typeof _rafThrottle>;
const cancel: Mock<() => void> = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
rafThrottle.mockImplementation(<T extends any[]>(fn: (...args: T) => void) =>
  Object.assign((...args: T) => fn(...args), { cancel }),
);

describe("#useRafThrottle", () => {
  it("should throttle the callback with rafThrottle and automatically cancel on unmount", () => {
    const callback = vi.fn();
    const utils = renderHook((cb: (...args: unknown[]) => unknown = callback) =>
      useRafThrottle(cb),
    );
    expect(rafThrottle).toHaveBeenCalledTimes(1);
    const getThrottled = () => utils.result.current;
    getThrottled()();
    expect(callback).toHaveBeenCalledTimes(1);

    getThrottled().cancel();
    expect(cancel).toHaveBeenCalledTimes(1);

    const nextCallback = vi.fn();
    utils.rerender(nextCallback);
    getThrottled()();
    expect(nextCallback).toHaveBeenCalledTimes(1);

    cancel.mockClear();
    utils.unmount();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
