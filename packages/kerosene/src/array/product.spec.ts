import product from "./product";

describe("#product", () => {
  it("should return a list containing an empty list when no sources are provided", () => {
    expect(product()).toEqual([[]]);
  });

  it("should return a list containing a list with the only item when only one source with one item is provided", () => {
    expect(product([1])).toEqual([[1]]);
  });

  it("should return the cartesian product of the source arrays", () => {
    expect(product([1, 2], [3, 4])).toEqual([
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
    ]);
  });

  it("should return the cartesian product of the source arrays when there are more than 2", () => {
    expect(product([1, 2, 3], [4, 5, 6], [7, 8, 9])).toEqual([
      [1, 4, 7],
      [1, 4, 8],
      [1, 4, 9],
      [1, 5, 7],
      [1, 5, 8],
      [1, 5, 9],
      [1, 6, 7],
      [1, 6, 8],
      [1, 6, 9],
      [2, 4, 7],
      [2, 4, 8],
      [2, 4, 9],
      [2, 5, 7],
      [2, 5, 8],
      [2, 5, 9],
      [2, 6, 7],
      [2, 6, 8],
      [2, 6, 9],
      [3, 4, 7],
      [3, 4, 8],
      [3, 4, 9],
      [3, 5, 7],
      [3, 5, 8],
      [3, 5, 9],
      [3, 6, 7],
      [3, 6, 8],
      [3, 6, 9],
    ]);
  });
});
