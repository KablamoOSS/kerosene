import round from "./round";

describe("#round", () => {
  it("should round with a default precision of 1", () => {
    expect(round(0.5)).toBe(1);
  });

  it("should round a value with precision", () => {
    expect(round(15, 10)).toBe(20);
  });
});
