import FakeTimers from "@sinonjs/fake-timers";
import waitForRepaint from "./waitForRepaint";

describe("#waitForRepaint", () => {
  let clock: FakeTimers.InstalledClock;
  let rAF: jest.SpiedFunction<typeof window.requestAnimationFrame>;
  let cAF: jest.SpiedFunction<typeof window.cancelAnimationFrame>;
  beforeEach(() => {
    clock = FakeTimers.install();
    rAF = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(
        clock.requestAnimationFrame as typeof window.requestAnimationFrame,
      );
    cAF = jest
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(
        clock.cancelAnimationFrame as typeof window.cancelAnimationFrame,
      );
  });

  afterEach(() => {
    clock.uninstall();
    jest.restoreAllMocks();
  });

  it("should call requestAnimationFrame twice", async () => {
    const promise = waitForRepaint();
    clock.runToFrame();
    clock.runToFrame();
    await expect(promise).resolves.toBe(undefined);
    expect(rAF).toHaveBeenCalledTimes(2);
  });

  it("should allow the promise to be cancelled", async () => {
    const promise = waitForRepaint();
    clock.runToFrame();
    promise.cancel();
    await expect(promise).rejects.toThrowError("waitForRepaint was cancelled");
    expect(cAF).toHaveBeenCalledTimes(1);
  });

  it("should allow the promise to be aborted", async () => {
    const controller = new AbortController();
    const promise = waitForRepaint({ signal: controller.signal });
    clock.runToFrame();
    controller.abort();
    await expect(promise).rejects.toThrowError("Aborted");
    expect(cAF).toHaveBeenCalledTimes(1);
  });
});
