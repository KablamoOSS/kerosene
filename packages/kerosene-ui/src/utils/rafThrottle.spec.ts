// @vitest-environment jsdom

import rafThrottle from "./rafThrottle";

vi.useFakeTimers();

describe("#rafThrottle", () => {
  it("should not allow calls more than once per frame", () => {
    const callback = vi.fn();
    const throttled = rafThrottle(callback);

    throttled();
    throttled();
    vi.advanceTimersByTime(17);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should allow the pending animation frame to be cancelled", () => {
    const callback = vi.fn();
    const throttled = rafThrottle(callback);

    throttled.cancel();
    vi.advanceTimersByTime(17);
    throttled();
    throttled.cancel();
    vi.advanceTimersByTime(17);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should remember the arguments when the callback is throttled", () => {
    const callback = vi.fn();
    const throttled = rafThrottle(callback);

    throttled(1);
    throttled(2);
    throttled(3);
    vi.advanceTimersByTime(17);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(1);
  });
});
