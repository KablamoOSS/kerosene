import rafThrottle from "./rafThrottle";

jest.useFakeTimers();

describe("#rafThrottle", () => {
  it("should not allow calls more than once per frame", () => {
    const callback = jest.fn();
    const throttled = rafThrottle(callback);

    throttled();
    throttled();
    jest.runTimersToTime(17);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should allow the pending animation frame to be cancelled", () => {
    const callback = jest.fn();
    const throttled = rafThrottle(callback);

    throttled.cancel();
    jest.runTimersToTime(17);
    throttled();
    throttled.cancel();
    jest.runTimersToTime(17);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should remember the arguments when the callback is throttled", () => {
    const callback = jest.fn();
    const throttled = rafThrottle(callback);

    throttled(1);
    throttled(2);
    throttled(3);
    jest.runTimersToTime(17);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(1);
  });
});
