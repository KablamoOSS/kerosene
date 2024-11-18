import { startOfDay, type ContextOptions } from "date-fns";

export type IsAfterDayOptions = ContextOptions<Date>;

/**
 * Returns whether the day of `date` is after the day of `dateToCompare`
 * @param date
 * @param dateToCompare
 * @param options
 */
export default function isAfterDay(
  date: Date | number,
  dateToCompare: Date | number,
  options?: IsAfterDayOptions,
): boolean {
  return (
    startOfDay(date, options).getTime() >
    startOfDay(dateToCompare, options).getTime()
  );
}
