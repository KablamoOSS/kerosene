/**
 * Returns the `quotient` and `remainder` for the integer division of `dividend` by `divisor`
 * @param dividend Integer dividend
 * @param divisor Integer divisor
 * @returns [quotient, remainder]
 */
export default function divmod(
  dividend: number,
  divisor: number,
): [number, number] {
  return [Math.floor(dividend / divisor), dividend % divisor];
}
