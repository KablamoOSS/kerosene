import { range } from "lodash";
import { Moment } from "moment";

export const SECOND = 1_000;

export const MINUTE = 60 * SECOND;

export const HOUR = 60 * MINUTE;

export const DAY = 24 * HOUR;

export const DAYS_PER_WEEK = 7;

export const MONTHS_PER_YEAR = 12;

export enum Month {
  JANUARY = 0,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER,
}

export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

/**
 * 7-tuple containing moments for each day of the calendar week
 */
export type CalendarWeek = [
  Moment,
  Moment,
  Moment,
  Moment,
  Moment,
  Moment,
  Moment
];

/**
 * 4-, 5-, or 6-tuple of calendar weeks which containing all of the days in a calendar month, plus the overhang (if any)
 * at either end of the month
 */
export type CalendarWeeks =
  | [CalendarWeek, CalendarWeek, CalendarWeek, CalendarWeek]
  | [CalendarWeek, CalendarWeek, CalendarWeek, CalendarWeek, CalendarWeek]
  | [
      CalendarWeek,
      CalendarWeek,
      CalendarWeek,
      CalendarWeek,
      CalendarWeek,
      CalendarWeek
    ];

/**
 * Returns a 4-, 5-, or 6-tuple of calendar weeks (7-tuples of moments) for the `month` of the moment provided.
 * @param month Moment for the month
 * @param firstDayOfWeek 0-indexed `DayOfWeek`
 */
export function getCalendarWeeks(
  month: Moment,
  firstDayOfWeek: DayOfWeek,
): CalendarWeeks {
  const firstOfMonth = month.clone().startOf("month");
  const lastOfMonth = month.clone().endOf("month");
  const priorDays =
    (firstOfMonth.day() + DAYS_PER_WEEK - firstDayOfWeek) % DAYS_PER_WEEK;
  const afterDays =
    (DAYS_PER_WEEK - firstDayOfWeek - lastOfMonth.day() + 1) % DAYS_PER_WEEK;
  const totalDays =
    priorDays + lastOfMonth.diff(firstOfMonth, "days") + 1 + afterDays;

  return range(totalDays / DAYS_PER_WEEK).map(
    week =>
      range(DAYS_PER_WEEK).map(dayOfWeek => {
        const delta = week * DAYS_PER_WEEK - priorDays + dayOfWeek;
        return firstOfMonth.clone().add(delta, "days");
      }) as CalendarWeek,
  ) as CalendarWeeks;
}
