import type { AngleDegrees, AngleRadians, MarkType } from "@kablamo/kerosene";

export type Point2D = MarkType<readonly [x: number, y: number], "Point2D">;

export type Delta2D = MarkType<readonly [dx: number, dy: number], "Delta2D">;

export type PolarVector2D = MarkType<
  readonly [r: number, theta: AngleRadians],
  "PolarVector2D"
>;

/**
 * Collection of SVG path d utils
 */
export const d = {
  /**
   *
   * @param rx
   * @param ry
   * @param angle Angle in degrees (not radians)
   * @param largeArc
   * @param clockwise
   * @param delta
   */
  arcBy(
    rx: number,
    ry: number,
    angle: AngleDegrees,
    largeArc: boolean,
    clockwise: boolean,
    [dx, dy]: Delta2D,
  ): string {
    return `a ${rx} ${ry} ${angle} ${largeArc ? 1 : 0} ${
      clockwise ? 1 : 0
    } ${dx},${dy}`;
  },
  /**
   *
   * @param rx
   * @param ry
   * @param angle Angle in degrees (not radians)
   * @param largeArc
   * @param clockwise
   * @param point
   */
  arcTo(
    rx: number,
    ry: number,
    angle: AngleDegrees,
    largeArc: boolean,
    clockwise: boolean,
    [x, y]: Point2D,
  ): string {
    return `A ${rx} ${ry} ${angle} ${largeArc ? 1 : 0} ${
      clockwise ? 1 : 0
    } ${x},${y}`;
  },
  closePath() {
    return "z";
  },
  cubicBezierBy(
    [dx1, dy1]: Delta2D,
    [dx2, dy2]: Delta2D,
    [dx, dy]: Delta2D,
  ): string {
    return `c ${dx1},${dy1},${dx2},${dy2},${dx},${dy}`;
  },
  cubicBezierTo([x1, y1]: Point2D, [x2, y2]: Point2D, [x, y]: Point2D): string {
    return `C ${x1},${y1},${x2},${y2},${x},${y}`;
  },
  lineBy([dx, dy]: Delta2D): string {
    return `l ${dx},${dy}`;
  },
  lineTo([x, y]: Point2D): string {
    return `L ${x},${y}`;
  },
  moveBy([dx, dy]: Delta2D): string {
    return `m ${dx},${dy}`;
  },
  moveTo([x, y]: Point2D): string {
    return `M ${x},${y}`;
  },
  quadraticBezierBy([dx1, dy1]: Delta2D, [dx, dy]: Delta2D): string {
    return `q ${dx1},${dy1},${dx},${dy}`;
  },
  quadraticBezierTo([x1, y1]: Point2D, [x, y]: Point2D): string {
    return `Q ${x1},${y1},${x},${y}`;
  },
  smoothCubicBezierBy([dx2, dy2]: Delta2D, [dx, dy]: Delta2D): string {
    return `s ${dx2},${dy2},${dx},${dy}`;
  },
  smoothCubicBezierTo([x2, y2]: Point2D, [x, y]: Point2D): string {
    return `S ${x2},${y2},${x},${y}`;
  },
  smoothQuadraticBezierBy([dx, dy]: Delta2D): string {
    return `t ${dx},${dy}`;
  },
  smoothQuadraticBezierTo([x, y]: Point2D): string {
    return `T ${x},${y}`;
  },
};

/**
 * Adds the vector `[r, theta]` to Point2D `[x, y]`
 * @param x Point2D cartesian x-coordinate
 * @param y Point2D cartesian y-coordinate
 * @param r Polar vector length
 * @param theta Polar vector angle in radians
 */
export function point2DPlusPolarVector(
  [x, y]: Point2D,
  [r, theta]: PolarVector2D,
): Point2D {
  return [x + Math.sin(theta) * r, y + Math.cos(theta) * r];
}
