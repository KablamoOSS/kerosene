import { startOfDay } from "date-fns";

/**
 * Returns whether the day of `date` is after the day of `dateToCompare`
 * @param date
 * @param dateToCompare
 */
export default function isAfterDay(
  date: Date | number,
  dateToCompare: Date | number,
): boolean {
  return startOfDay(date).getTime() > startOfDay(dateToCompare).getTime();
}
