import floor from "./floor";

describe("#floor", () => {
  it("should floor with a default precision of 1", () => {
    expect(floor(0.5)).toBe(0);
  });

  it("should floor a value with precision", () => {
    expect(floor(15, 10)).toBe(10);
  });
});
