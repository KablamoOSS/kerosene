/**
 * Ceils a value with precision
 * @param value
 * @param precision
 */
export default function ceil(value: number, precision = 1) {
  return Math.ceil(value / precision) * precision;
}
