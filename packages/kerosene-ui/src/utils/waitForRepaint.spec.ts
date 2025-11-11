// @vitest-environment jsdom

import FakeTimers from "@sinonjs/fake-timers";
import type { Mock } from "vitest";
import waitForRepaint from "./waitForRepaint";

describe("#waitForRepaint", () => {
  let clock: FakeTimers.InstalledClock;
  let rAF: Mock<typeof window.requestAnimationFrame>;
  let cAF: Mock<typeof window.cancelAnimationFrame>;
  beforeEach(() => {
    clock = FakeTimers.install();
    rAF = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(
        clock.requestAnimationFrame as typeof window.requestAnimationFrame,
      );
    cAF = vi
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(
        clock.cancelAnimationFrame as typeof window.cancelAnimationFrame,
      );
  });

  afterEach(() => {
    clock.uninstall();
    vi.restoreAllMocks();
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
    await expect(promise).rejects.toThrow("waitForRepaint was cancelled");
    expect(cAF).toHaveBeenCalledTimes(1);
  });

  it("should allow the promise to be aborted", async () => {
    const controller = new AbortController();
    const promise = waitForRepaint({ signal: controller.signal });
    clock.runToFrame();
    controller.abort();
    await expect(promise).rejects.toThrow("Aborted");
    expect(cAF).toHaveBeenCalledTimes(1);
  });
});
