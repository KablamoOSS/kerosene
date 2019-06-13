import moment, { Moment } from "moment";
import { getCalendarWeeks, DayOfWeek, DAYS_PER_WEEK, Month } from ".";

describe("#getCalendarWeeks", () => {
  it("should return correctly for a month that exactly fits with (February 2021)", () => {
    const weeks = getCalendarWeeks(moment("2021-02-01"), DayOfWeek.MONDAY);
    expect(weeks).toHaveLength(4);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat<Moment>().forEach((day, index) => {
      expect(
        day.isSame(
          moment()
            .year(2021)
            .month(Month.FEBRUARY)
            .date(index + 1),
          "day",
        ),
      ).toBe(true);
    });
  });

  it("should return correctly for a regular month which starts on a Monday (April 2019)", () => {
    const weeks = getCalendarWeeks(moment("2019-04-01"), DayOfWeek.MONDAY);
    expect(weeks).toHaveLength(5);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat<Moment>().forEach((day, index) => {
      expect(
        day.isSame(
          moment()
            .year(2019)
            .month(index >= 30 ? Month.MAY : Month.APRIL)
            .date((index % 30) + 1),
          "day",
        ),
      ).toBe(true);
    });
  });

  it("should return correctly for a regular month which finishes on a Sunday (June 2019)", () => {
    const weeks = getCalendarWeeks(moment("2019-06-01"), DayOfWeek.MONDAY);
    expect(weeks).toHaveLength(5);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat<Moment>().forEach((day, index) => {
      expect(
        day.isSame(
          moment()
            .year(2019)
            .month(index < DayOfWeek.FRIDAY ? Month.MAY : Month.JUNE)
            .date(
              index +
                (index < DayOfWeek.FRIDAY
                  ? 31 - DayOfWeek.FRIDAY
                  : -DayOfWeek.FRIDAY) +
                1,
            ),
          "day",
        ),
      ).toBe(true);
    });
  });

  it("should return correctly for a regular month that starts on a Sunday (September 2019)", () => {
    const weeks = getCalendarWeeks(moment("2019-09-01"), DayOfWeek.MONDAY);
    expect(weeks).toHaveLength(6);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_PER_WEEK));

    weeks.flat<Moment>().forEach((day, index) => {
      expect(
        day.isSame(
          moment()
            .year(2019)
            .month(
              index < DayOfWeek.SATURDAY
                ? Month.AUGUST
                : index >= 30 + DayOfWeek.SATURDAY
                ? Month.OCTOBER
                : Month.SEPTEMBER,
            )
            .date(
              index < DayOfWeek.SATURDAY
                ? 31 - DayOfWeek.SATURDAY + index + 1
                : ((index - DayOfWeek.SATURDAY) % 30) + 1,
            ),
          "day",
        ),
      ).toBe(true);
    });
  });
});
