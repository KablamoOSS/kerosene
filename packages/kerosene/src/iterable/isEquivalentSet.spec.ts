import isEquivalentSet from "./isEquivalentSet";

describe("#isEquivalentSet", () => {
  it("should consider empty lists equivalent", () => {
    expect(isEquivalentSet([], [])).toBe(true);
  });

  it("should consider a list equivalent to itself", () => {
    const list = [1];
    expect(isEquivalentSet(list, list)).toBe(true);
  });

  it("should consider lists with the same items in the same order equivalent", () => {
    const list = [1, 2, 3];
    expect(isEquivalentSet(list, [...list])).toBe(true);
  });

  it("should consider lists with the same items in a different order equivalent", () => {
    const list = [1, 2, 3];
    expect(isEquivalentSet(list, [...list].reverse())).toBe(true);
  });

  it("should consider lists containing duplicates as equivalent", () => {
    const list = [1, 2, 3];
    expect(isEquivalentSet(list, [...list, ...list])).toBe(true);
  });

  it("should consider lists containing different items as not equivalent", () => {
    const list = [1, 2, 3];
    expect(isEquivalentSet(list, [...list, 4, 5, 6])).toBe(false);
  });

  it("should consider equivalent sets", () => {
    expect(isEquivalentSet(new Set([1]), new Set([1]))).toBe(true);
  });

  it("should consider equivalent sets of different types", () => {
    expect(isEquivalentSet(new Set([1]), [1])).toBe(true);
  });
});
