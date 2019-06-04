/**
 * Returns the value in radians converted to degrees
 * @param radians
 */
export default function toDegrees(radians: number): number {
  return (180 * radians) / Math.PI;
}
