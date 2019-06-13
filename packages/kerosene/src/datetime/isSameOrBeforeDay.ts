import { isSameDay } from "date-fns";
import isBeforeDay from "./isBeforeDay";

/**
 * Returns whether the day of `date` is the same or before the day of `dateToCompare`
 * @param date
 * @param dateToCompare
 */
export default function isSameOrBeforeDay(
  date: Date | number | string,
  dateToCompare: Date | number | string,
): boolean {
  return isSameDay(date, dateToCompare) || isBeforeDay(date, dateToCompare);
}
