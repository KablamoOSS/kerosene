import { type Point2D, d, point2DPlusPolarVector } from "./svg";

describe("SVG utils", () => {
  describe("d", () => {
    describe("#arcBy", () => {
      it("should return the command", () => {
        expect(d.arcBy(1, 2, 45, false, true, [3, 4])).toBe("a 1 2 45 0 1 3,4");
      });
    });

    describe("#arcTo", () => {
      it("should return the command", () => {
        expect(d.arcTo(1, 2, 45, true, false, [3, 4])).toBe("A 1 2 45 1 0 3,4");
      });
    });

    describe("#closePath", () => {
      it("should return the command", () => {
        expect(d.closePath()).toBe("z");
      });
    });

    describe("#cubicBezierBy", () => {
      it("should return the command", () => {
        expect(d.cubicBezierBy([1, 2], [3, 4], [5, 6])).toBe("c 1,2,3,4,5,6");
      });
    });

    describe("#cubicBezierTo", () => {
      it("should return the command", () => {
        expect(d.cubicBezierTo([1, 2], [3, 4], [5, 6])).toBe("C 1,2,3,4,5,6");
      });
    });

    describe("#lineBy", () => {
      it("should return the command", () => {
        expect(d.lineBy([1, 2])).toBe("l 1,2");
      });
    });

    describe("#lineTo", () => {
      it("should return the command", () => {
        expect(d.lineTo([1, 2])).toBe("L 1,2");
      });
    });

    describe("#moveBy", () => {
      it("should return the command", () => {
        expect(d.moveBy([1, 2])).toBe("m 1,2");
      });
    });

    describe("#moveTo", () => {
      it("should return the command", () => {
        expect(d.moveTo([1, 2])).toBe("M 1,2");
      });
    });

    describe("#quadraticBezierBy", () => {
      it("should return the command", () => {
        expect(d.quadraticBezierBy([1, 2], [3, 4])).toBe("q 1,2,3,4");
      });
    });

    describe("#quadraticBezierTo", () => {
      it("should return the command", () => {
        expect(d.quadraticBezierTo([1, 2], [3, 4])).toBe("Q 1,2,3,4");
      });
    });

    describe("#smoothCubicBezierBy", () => {
      it("should return the command", () => {
        expect(d.smoothCubicBezierBy([1, 2], [3, 4])).toBe("s 1,2,3,4");
      });
    });

    describe("#smoothCubicBezierTo", () => {
      it("should return the command", () => {
        expect(d.smoothCubicBezierTo([1, 2], [3, 4])).toBe("S 1,2,3,4");
      });
    });

    describe("#smoothQuadraticBezierBy", () => {
      it("should return the command", () => {
        expect(d.smoothQuadraticBezierBy([1, 2])).toBe("t 1,2");
      });
    });

    describe("#smoothQuadraticBezierTo", () => {
      it("should return the command", () => {
        expect(d.smoothQuadraticBezierTo([1, 2])).toBe("T 1,2");
      });
    });
  });

  describe("point2DPlusPolarVector", () => {
    it.each([
      {
        args: [
          [0, 0],
          [Math.SQRT2, Math.PI / 4],
        ],
        expected: [1, 1],
      },
      {
        args: [
          [1, 1],
          [2 * Math.SQRT2, Math.PI + Math.PI / 4],
        ],
        expected: [-1, -1],
      },
    ] satisfies ReadonlyArray<{
      args: Parameters<typeof point2DPlusPolarVector>;
      expected: Point2D;
    }>)(
      "should return $expected for ([$args.0.0, $args.0.1], [$args.1.0, $args.1.1])",
      ({ args, expected: [x, y] }) => {
        expect(point2DPlusPolarVector(...args)).toEqual([
          expect.closeTo(x),
          expect.closeTo(y),
        ]);
      },
    );
  });
});
