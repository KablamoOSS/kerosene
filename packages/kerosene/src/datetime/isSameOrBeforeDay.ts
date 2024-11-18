import { isSameDay, type ContextOptions } from "date-fns";
import isBeforeDay from "./isBeforeDay";

export type IsSameOrBeforeDayOptions = ContextOptions<Date>;

/**
 * Returns whether the day of `date` is the same or before the day of `dateToCompare`
 * @param date
 * @param dateToCompare
 * @param options
 */
export default function isSameOrBeforeDay(
  date: Date | number,
  dateToCompare: Date | number,
  options?: ContextOptions<Date>,
): boolean {
  return (
    isSameDay(date, dateToCompare, options) ||
    isBeforeDay(date, dateToCompare, options)
  );
}
