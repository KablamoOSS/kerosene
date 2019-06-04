import isNegative from "./isNegative";

describe("#isNegative", () => {
  [
    { value: 0, expected: false },
    { value: -0, expected: true },
    { value: 1, expected: false },
    { value: -1, expected: true },
    { value: NaN, expected: false },
    { value: Infinity, expected: false },
    { value: -Infinity, expected: true },
  ].forEach(({ value, expected }) => {
    it(`should return ${expected} for ${
      value === 0 ? `${Object.is(value, -0) ? "-" : "+"}0` : value
    }`, () => {
      expect(isNegative(value)).toBe(expected);
    });
  });
});
