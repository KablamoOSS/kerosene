import intersects from "./intersects";

describe("#intersects", () => {
  it("should return false for empty lists", () => {
    expect(intersects([], [])).toBe(false);
  });

  it("should return false for lists containing different elements", () => {
    expect(intersects([1, 2, 3], [4, 5, 6])).toBe(false);
  });

  it("should return true for the same list", () => {
    const list = [1];
    expect(intersects(list, list)).toBe(true);
  });

  it("should return true for lists with the same items", () => {
    const list = [1, 2, 3];
    expect(intersects(list, [...list].reverse())).toBe(true);
  });

  it("should return true for lists containing at least 1 overlapping item", () => {
    expect(intersects([1, 2, 3], [3, 4, 5])).toBe(true);
  });

  it("should return true for sets containing the same items", () => {
    expect(intersects(new Set([1]), new Set([1]))).toBe(true);
  });

  it("should return true for different iterable types containing the same items", () => {
    expect(intersects(new Set([1]), [1])).toBe(true);
  });
});
