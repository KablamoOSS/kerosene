import { renderHook } from "@testing-library/react-hooks";
import _rafThrottle from "../utils/rafThrottle";
import useRafThrottle from "./useRafThrottle";

jest.mock("../utils/rafThrottle");

const rafThrottle = _rafThrottle as jest.MockedFunction<typeof _rafThrottle>;
const cancel: jest.Mock<void, []> = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
rafThrottle.mockImplementation(<T extends any[]>(fn: (...args: T) => void) =>
  Object.assign((...args: T) => fn(...args), { cancel }),
);

describe("#useRafThrottle", () => {
  it("should throttle the callback with rafThrottle and automatically cancel on unmount", () => {
    const callback = jest.fn();
    const utils = renderHook((cb: (...args: unknown[]) => unknown = callback) =>
      useRafThrottle(cb),
    );
    expect(rafThrottle).toHaveBeenCalledTimes(1);
    const getThrottled = () => utils.result.current;
    getThrottled()();
    expect(callback).toHaveBeenCalledTimes(1);

    getThrottled().cancel();
    expect(cancel).toHaveBeenCalledTimes(1);

    const nextCallback = jest.fn();
    utils.rerender(nextCallback);
    getThrottled()();
    expect(nextCallback).toHaveBeenCalledTimes(1);

    cancel.mockClear();
    utils.unmount();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
