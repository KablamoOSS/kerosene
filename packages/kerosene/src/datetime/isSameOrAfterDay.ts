import { isSameDay, type ContextOptions } from "date-fns";
import isAfterDay from "./isAfterDay";

export type IsSameOrAfterDayOptions = ContextOptions<Date>;

/**
 * Returns whether the day of `date` is the same or after the day of `dateToCompare`
 * @param date
 * @param dateToCompare
 * @param options
 */
export default function isSameOrAfterDay(
  date: Date | number,
  dateToCompare: Date | number,
  options?: IsSameOrAfterDayOptions,
): boolean {
  return (
    isSameDay(date, dateToCompare, options) ||
    isAfterDay(date, dateToCompare, options)
  );
}
