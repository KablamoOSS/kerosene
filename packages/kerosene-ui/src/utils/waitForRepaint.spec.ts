import waitForRepaint from "./waitForRepaint";

jest.useFakeTimers();

describe("#waitForRepaint", () => {
  let rAF: jest.Mock<number, [FrameRequestCallback]>;
  let cAF: jest.Mock<void, [number]>;
  beforeEach(() => {
    rAF = jest
      .fn()
      .mockImplementation((callback: FrameRequestCallback) =>
        setTimeout(() => callback(Date.now()), 17),
      );
    cAF = jest
      .fn()
      .mockImplementation((handle: number) => clearTimeout(handle));
    Object.assign(window, {
      requestAnimationFrame: rAF,
      cancelAnimationFrame: cAF,
    });
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
});
