import {
  daysInWeek,
  millisecondsInDay,
  millisecondsInHour,
  millisecondsInMinute,
  millisecondsInSecond,
  monthsInYear,
} from "date-fns/constants";

/**
 * Milliseconds in one second
 */
export const SECOND = millisecondsInSecond;

/**
 * Milliseconds in one minute
 */
export const MINUTE = millisecondsInMinute;

/**
 * Milliseconds in one hour
 */
export const HOUR = millisecondsInHour;

/**
 * Milliseconds in one 24-hour day
 *
 * Be aware of the [falsehoods programmers believe about time](https://gist.github.com/timvisee/fcda9bbdff88d45cc9061606b4b923ca).
 * Not all days have 24 hours.
 */
export const DAY = millisecondsInDay;

/**
 * Number of days in one week
 */
export const DAYS_PER_WEEK = daysInWeek;

/**
 * Number of months in one year
 */
export const MONTHS_PER_YEAR = monthsInYear;

/**
 * A 0-indexed enum for the months of the Gregorian Calendar
 */
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

/**
 * A 0-indexed enum for the days of the week, starting at Sunday
 */
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}
