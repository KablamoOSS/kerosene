import { startOfDay, type ContextOptions } from "date-fns";

export type IsBeforeDayOptions = ContextOptions<Date>;

/**
 * Returns whether the day of `date` is before the day of `dateToCompare`
 * @param date
 * @param dateToCompare
 * @param options
 */
export default function isBeforeDay(
  date: Date | number,
  dateToCompare: Date | number,
  options?: IsBeforeDayOptions,
): boolean {
  return (
    startOfDay(date, options).getTime() <
    startOfDay(dateToCompare, options).getTime()
  );
}
