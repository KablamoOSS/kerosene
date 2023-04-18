import {
  brandT,
  type OpaqueType,
  type BrandType,
  opaqueT,
  underlyingT,
  isRecord,
} from ".";

const underlying = "underlying";

describe("type utilities", () => {
  describe("#brandT", () => {
    it("should brand the type", () => {
      type Branded = BrandType<string, "Brand">;
      const branded = brandT<Branded>(underlying);
      expect(branded).toBe(underlying);
    });
  });

  describe("#opaqueT", () => {
    it("should return an opaque branded type", () => {
      type Opaque = OpaqueType<string, "Brand">;
      const opaque = opaqueT<Opaque>(underlying);
      expect(opaque).toBe(underlying);

      // @ts-expect-error 'length' property of string should be inaccessible
      expect(opaque.length).toBe(underlying.length);
    });
  });

  describe("#underlying", () => {
    it("should return the underlying type", () => {
      type Opaque = OpaqueType<string, "Brand">;
      const opaque = opaqueT<Opaque>(underlying);

      expect(underlyingT(opaque).length).toBe(underlying.length);
    });
  });

  describe("isRecord", () => {
    it.each([
      { scenario: "null", obj: null, expected: false },
      { scenario: "undefined", obj: undefined, expected: false },
      { scenario: "plain object", obj: {}, expected: true },
      { scenario: "Error", obj: new Error("an error"), expected: true },
    ])("should return $expected for $scenario", ({ obj, expected }) => {
      expect(isRecord(obj)).toBe(expected);
    });
  });
});
