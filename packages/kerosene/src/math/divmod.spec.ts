import divmod from "./divmod";

describe("#divmod", () => {
  it("should return a quotient and reminder", () => {
    const result = divmod(1, 1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.any(Number));
    expect(result[1]).toEqual(expect.any(Number));
  });

  it("should produce the correct result", () => {
    expect(divmod(123, 60)).toEqual([2, 3]);
    expect(divmod(1, 1)).toEqual([1, 0]);
  });
});
