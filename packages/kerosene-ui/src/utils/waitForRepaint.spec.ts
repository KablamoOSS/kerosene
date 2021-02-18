import createSandbox from "jest-sandbox";
import waitForRepaint from "./waitForRepaint";

const sandbox = createSandbox();

const rAF = sandbox.spyOn(window, "requestAnimationFrame");
const cAF = sandbox.spyOn(window, "cancelAnimationFrame");

jest.useFakeTimers();

describe("#waitForRepaint", () => {
  afterEach(() => {
    sandbox.clear();
  });

  it("should call requestAnimationFrame twice", async () => {
    const promise = waitForRepaint();
    jest.runTimersToTime(34);
    await expect(promise).resolves.toBe(undefined);
    expect(rAF).toHaveBeenCalledTimes(2);
  });

  it("should allow the promise to be cancelled", async () => {
    const promise = waitForRepaint();
    jest.runTimersToTime(17);
    promise.cancel();
    await expect(promise).rejects.toThrowError("waitForRepaint was cancelled");
    expect(cAF).toHaveBeenCalledTimes(1);
  });

  it("should allow the promise to be aborted", async () => {
    const controller = new AbortController();
    const promise = waitForRepaint({ signal: controller.signal });
    jest.runTimersToTime(17);
    controller.abort();
    await expect(promise).rejects.toThrowError("Aborted");
    expect(cAF).toHaveBeenCalledTimes(1);
  });
});
