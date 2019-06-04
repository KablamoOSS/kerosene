/**
 * Rounds a value with precision
 * @param value
 * @param precision
 */
export default function round(value: number, precision = 1) {
  return Math.round(value / precision) * precision;
}
