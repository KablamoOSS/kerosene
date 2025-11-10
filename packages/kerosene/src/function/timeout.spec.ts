import { SECOND } from "../datetime";
import timeout from "./timeout";

jest.useFakeTimers();

describe("#timeout", () => {
  it("should resolve after the timeout period", async () => {
    const promise = timeout(SECOND);
    jest.advanceTimersByTime(SECOND);
    await expect(promise).resolves.toBeUndefined();
  });

  it("should allow the promise to be cancelled", async () => {
    const promise = timeout(SECOND);
    promise.cancel();
    await expect(promise).rejects.toThrow("Cancelled");
  });

  it("should allow the promise to be aborted", async () => {
    const controller = new AbortController();
    const promise = timeout(SECOND, { signal: controller.signal });
    controller.abort();
    await expect(promise).rejects.toThrow("Aborted");
  });
});
