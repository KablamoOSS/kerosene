/**
 * Returns the value in degrees converted to radians
 * @param radians
 */
export default function toDegrees(degrees: number): number {
  return (Math.PI * degrees) / 180;
}
