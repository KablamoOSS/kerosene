import ceil from "./ceil";

describe("#ceil", () => {
  it("should ceil with a default precision of 1", () => {
    expect(ceil(0.4)).toBe(1);
  });

  it("should ceil a value with precision", () => {
    expect(ceil(14, 10)).toBe(20);
  });
});
