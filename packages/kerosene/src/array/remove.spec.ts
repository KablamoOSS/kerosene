import remove from "./remove";

describe("#remove", () => {
  it("should return an empty array when passed an empty array", () => {
    expect(remove("anything", [] as string[])).toEqual([]);
  });

  it("should return an empty array when the array contains nothing except for one instance of the item to remove", () => {
    expect(remove("hello", ["hello"])).toEqual([]);
  });

  it("should return an empty array when the input contains only repititions of the item to remove", () => {
    const needle = "hello";
    const haystack = [needle, needle, needle];

    expect(remove(needle, haystack)).toEqual([]);
  });

  it("should return an array that contains only the items that are not equal to the item to remove", () => {
    const needle = "hello";
    const haystack = [needle, needle.toUpperCase(), needle, 1, 2, 3];

    expect(remove(needle, haystack)).toEqual([needle.toUpperCase(), 1, 2, 3]);
  });

  it("should return an array that is equal to the input array (but is not the same array) when the input array does not contain any instances of the item to remove", () => {
    const needle = "hello";
    const haystack = [1, 2, 3, 4, 5];

    const result = remove(needle, haystack as unknown[]);
    expect(result).not.toBe(haystack);

    expect(result).toEqual(haystack);
  });
});
