import FakeTimers from "@sinonjs/fake-timers";
import { SECOND } from "../datetime";
import timeout from "../function/timeout";
import mapSeries from "./mapSeries";

describe("mapSeries", () => {
  let clock: FakeTimers.InstalledClock;
  beforeEach(() => {
    clock = FakeTimers.install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  it("should execute Promises in series, accumulating the results", async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    const items = ["a", "b", "c"] as const;
    const promise = mapSeries(items, async (value, index, array) => {
      // eslint-disable-next-line no-plusplus
      maxConcurrent = Math.max(maxConcurrent, ++concurrent);

      await timeout(SECOND);

      // eslint-disable-next-line no-plusplus
      concurrent--;
      return { value, index, array };
    });

    await clock.tickAsync(items.length * SECOND);

    await expect(promise).resolves.toEqual(
      items.map((value, index, array) => ({ value, index, array })),
    );

    expect(maxConcurrent).toBe(1);
  });
});
