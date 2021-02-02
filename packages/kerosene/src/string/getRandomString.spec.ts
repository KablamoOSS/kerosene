import getRandomString from "./getRandomString";

describe("#getRandomString", () => {
  it("should return a different string every time", () => {
    const ITERATIONS_TO_TRY = 250;
    const iterations = new Set();

    // eslint-disable-next-line no-plusplus
    for (let ii = 0; ii < ITERATIONS_TO_TRY; ii++) {
      iterations.add(getRandomString());
    }

    /**
     * Sets only allow unique values, so the size of the set is equal
     * to the number of unique values it holds.
     */
    expect(iterations.size).toBe(ITERATIONS_TO_TRY);
  });
});
