/**
 * Returns whether or not the value is negative (including negative zero)
 * @param value
 */
export default function isNegative(value: number): boolean {
  // This behaves exactly like `value !== Math.abs(value)` except in the case of positive and negative zero
  // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  return !Object.is(value, Math.abs(value));
}
