/**
 * Floors a value with precision
 * @param value
 * @param precision
 */
export default function floor(value: number, precision = 1) {
  return Math.floor(value / precision) * precision;
}
