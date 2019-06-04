import clamp from "./clamp";

describe("#clamp", () => {
  const MIN = 1;
  const MAX = 3;

  it("should return a value that is in between the min and max", () => {
    expect(clamp(MIN, 2, MAX)).toBe(2);
  });

  it("should return the min when the value is less", () => {
    expect(clamp(MIN, 0, MAX)).toBe(MIN);
  });

  it("should return the max when the value is greater", () => {
    expect(clamp(MIN, 4, MAX)).toBe(MAX);
  });

  it("should return the input min when min and max are in the wrong order", () => {
    expect(clamp(3, 2, 1)).toBe(3);
  });
});
