import elide from "./elide";
import getRandomString from "./getRandomString";

describe("#elide", () => {
  it("should return the input as-is if max length is greater than input length", () => {
    const input = "Hello, world!" + getRandomString();

    expect(elide(input, input.length + 1)).toEqual(input);
  });

  it("should return the input as-is if max length is equal to input length", () => {
    const input = "Hello, world!" + getRandomString();

    expect(elide(input, input.length)).toEqual(input);
  });

  it("should return the first N characters where max length is N and string length is longer than N, where the elide-string is ''", () => {
    const input = "Hello, world!" + getRandomString();

    expect(elide(input, input.length / 2, "")).toEqual(
      input.slice(0, input.length / 2),
    );
  });

  it("should return the first N characters, with the elide-string is tacked onto the end, overwriting any characters from the right, not increasing the max length, where the string length is longer than N", () => {
    const input = "1234567890";
    const elideString = "CUTOFF";
    expect(elide(input, "123CUTOFF".length, elideString)).toBe("123CUTOFF");
  });
});
