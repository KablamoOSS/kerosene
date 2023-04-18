import type { AngleDegrees, AngleRadians } from "./types";

/**
 * Returns the value in radians converted to degrees
 * @param radians
 */
export default function toDegrees(radians: AngleRadians): AngleDegrees {
  return (180 * radians) / Math.PI;
}
