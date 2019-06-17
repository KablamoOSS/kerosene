/**
 * Returns the provided `value` rounded to the number of significant `figures` provided
 * @param value
 * @param figures Integer number of significant figures
 */
export default function toSignificantFigures(
  value: number,
  figures: number,
): number {
  return parseFloat(value.toPrecision(figures));
}
