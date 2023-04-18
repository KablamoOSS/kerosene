import type { AngleDegrees, AngleRadians } from "./types";

/**
 * Returns the value in degrees converted to radians
 * @param radians
 */
export default function toDegrees(degrees: AngleDegrees): AngleRadians {
  return (Math.PI * degrees) / 180;
}
