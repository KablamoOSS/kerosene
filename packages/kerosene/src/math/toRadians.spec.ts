import toRadians from "./toRadians";

describe("#toRadians", () => {
  it("should convert values from degrees to radians", () => {
    (
      [
        [0, 0],
        [Math.PI / 8, 22.5],
        [Math.PI / 6, 30],
        [Math.PI / 4, 45],
        [Math.PI / 3, 60],
        [Math.PI / 2, 90],
        [Math.PI, 180],
        [(Math.PI * 3) / 2, 270],
        [2 * Math.PI, 360],
      ] as const
    ).forEach(([radians, degrees]) => {
      expect(toRadians(degrees)).toBeCloseTo(radians, 5);
    });
  });
});
