import caseInsensitiveEquals from "./caseInsensitiveEquals";

describe("#caseInsensitiveEquals", () => {

  it("should return true when the two strings are empty", () => {
    expect(
        caseInsensitiveEquals("", ""),
    ).toBe(
        true,
    );
  });

  it("should return false when the string has different letters", () => {
    expect(
        caseInsensitiveEquals("aaa", "bbb"),
    ).not.toBe(
        true,
    );
  });

  it("should return true when the string is strictly equal", () => {
    expect(
        caseInsensitiveEquals("aaa", "aaa"),
    ).toBe(
        true,
    );
  });

  it("should return true when the only difference is letter casing", () => {
    expect(
        caseInsensitiveEquals("Aaa", "aaA"),
    ).toBe(
        true,
    );

    expect(
        caseInsensitiveEquals("aBcDeF", "AbCdEf"),
    ).toBe(
        true,
    );
  });
});
