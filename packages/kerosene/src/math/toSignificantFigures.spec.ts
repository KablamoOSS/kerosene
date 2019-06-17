import toSignificantFigures from "./toSignificantFigures";

describe("#toSignificantFigures", () => {
  [
    {
      value: 1,
      figures: 1,
      expected: 1,
    },
    {
      value: 0.1,
      figures: 1,
      expected: 0.1,
    },
    {
      value: 123,
      figures: 1,
      expected: 100,
    },
    {
      value: 0.00123,
      figures: 1,
      expected: 0.001,
    },
    {
      value: 12345,
      figures: 3,
      expected: 12300,
    },
    {
      value: 0.0012345,
      figures: 3,
      expected: 0.00123,
    },
  ].forEach(({ value, figures, expected }) => {
    it(`should return ${expected} for the value ${value} with ${figures} significant figure(s)`, () => {
      expect(toSignificantFigures(value, figures)).toBe(expected);
    });
  });
});
