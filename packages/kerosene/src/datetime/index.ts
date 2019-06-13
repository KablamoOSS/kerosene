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

export { default as getCalendarWeeks } from "./getCalendarWeeks";
import {
  CalendarWeek as _CalendarWeek,
  CalendarWeeks as _CalendarWeeks,
} from "./getCalendarWeeks";
export type CalendarWeek = _CalendarWeek;
export type CalendarWeeks = _CalendarWeeks;
export { default as isAfterDay } from "./isAfterDay";
export { default as isBeforeDay } from "./isBeforeDay";
export { default as isSameOrAfterDay } from "./isSameOrAfterDay";
export { default as isSameOrBeforeDay } from "./isSameOrBeforeDay";
