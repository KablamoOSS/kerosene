import { parseISO } from "date-fns";
import isSameOrAfterDay from "./isSameOrAfterDay";

describe("#isSameOrAfterDay", () => {
  it("should return true if the date is after the dateToCompare", () => {
    expect(
      isSameOrAfterDay(parseISO("2019-06-13"), parseISO("2019-06-12")),
    ).toBe(true);
  });

  it("should return false if the date is before the dateToCompare", () => {
    expect(
      isSameOrAfterDay(parseISO("2019-06-11"), parseISO("2019-06-12")),
    ).toBe(false);
  });

  it("should return true if the date is the same as the dateToCompare", () => {
    expect(
      isSameOrAfterDay(parseISO("2019-06-12"), parseISO("2019-06-12")),
    ).toBe(true);
  });

  it("should return true if the date is the same (but before in time) as the dateToCompare", () => {
    expect(
      isSameOrAfterDay(
        parseISO("2019-06-12T00:00:00.000"),
        parseISO("2019-06-12T23:59:59.999"),
      ),
    ).toBe(true);
  });
});
