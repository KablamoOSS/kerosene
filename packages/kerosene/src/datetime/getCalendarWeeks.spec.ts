import * as dateFns from "date-fns";
import { Month, DayOfWeek, DAYS_PER_WEEK } from "../datetime";
import getCalendarWeeks from "./getCalendarWeeks";

const expectSameDay = (
  compare: Date,
  year: number,
  month: Month,
  date: number,
) => {
  const compareTo = dateFns.setDate(
    dateFns.setMonth(dateFns.setYear(new Date(), year), month),
    date,
  );
  expect(dateFns.isSameDay(compare, compareTo)).toBe(true);
};

describe("#getCalendarWeeks", () => {
  it("should return correctly for a month that exactly fits with (February 2021)", () => {
    const weeks = getCalendarWeeks(
      dateFns.parseISO("2021-02-01T00:00:00.000"),
      DayOfWeek.MONDAY,
    );
    expect(weeks).toHaveLength(4);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat().forEach((day, index) => {
      expectSameDay(day, 2021, Month.FEBRUARY, index + 1);
    });
  });

  it("should return correctly for a regular month which starts on a Monday (April 2019)", () => {
    const weeks = getCalendarWeeks(
      dateFns.parseISO("2019-04-01T00:00:00.000"),
      DayOfWeek.MONDAY,
    );
    expect(weeks).toHaveLength(5);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat().forEach((day, index) => {
      expectSameDay(
        day,
        2019,
        index >= 30 ? Month.MAY : Month.APRIL,
        (index % 30) + 1,
      );
    });
  });

  it("should return correctly for a regular month which finishes on a Sunday (June 2019)", () => {
    const weeks = getCalendarWeeks(
      dateFns.parseISO("2019-06-01T00:00:00.000"),
      DayOfWeek.MONDAY,
    );
    expect(weeks).toHaveLength(5);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat().forEach((day, index) => {
      expectSameDay(
        day,
        2019,
        index < DayOfWeek.FRIDAY ? Month.MAY : Month.JUNE,
        index +
          (index < DayOfWeek.FRIDAY
            ? 31 - DayOfWeek.FRIDAY
            : -DayOfWeek.FRIDAY) +
          1,
      );
    });
  });

  it("should return correctly for a regular month that starts on a Sunday (September 2019)", () => {
    const weeks = getCalendarWeeks(
      dateFns.parseISO("2019-09-01T00:00:00.000"),
      DayOfWeek.MONDAY,
    );
    expect(weeks).toHaveLength(6);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat().forEach((day, index) => {
      expectSameDay(
        day,
        2019,
        index < DayOfWeek.SATURDAY
          ? Month.AUGUST
          : index >= 30 + DayOfWeek.SATURDAY
          ? Month.OCTOBER
          : Month.SEPTEMBER,
        index < DayOfWeek.SATURDAY
          ? 31 - DayOfWeek.SATURDAY + index + 1
          : ((index - DayOfWeek.SATURDAY) % 30) + 1,
      );
    });
  });
});
