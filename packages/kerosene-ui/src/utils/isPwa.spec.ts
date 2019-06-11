import createSandbox from "jest-sandbox";
import { when } from "jest-when";
import isPwa from "./isPwa";

describe("#isPwa", () => {
  let sandbox: JestSandbox;
  let matchMedia: jest.Mock<
    ReturnType<typeof window.matchMedia>,
    Parameters<typeof window.matchMedia>
  >;
  beforeEach(() => {
    sandbox = createSandbox();
    matchMedia = sandbox.fn();
    matchMedia.mockImplementation(() => {
      throw new Error("matchMedia was called with incorrect args");
    });
    window.matchMedia = matchMedia;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("when not in a PWA (not Safari)", () => {
    beforeEach(() => {
      when(matchMedia)
        .calledWith("(display-mode: standalone)")
        .mockReturnValue(({ matches: false } as Partial<
          MediaQueryList
        >) as MediaQueryList);
      Object.assign(navigator, { standalone: undefined });
    });

    it("should return false", () => {
      expect(isPwa()).toBe(false);
    });
  });

  describe("when not in a PWA (Safari)", () => {
    beforeEach(() => {
      when(matchMedia)
        .calledWith("(display-mode: standalone)")
        .mockReturnValue(({ matches: false } as Partial<
          MediaQueryList
        >) as MediaQueryList);
      Object.assign(navigator, { standalone: false });
    });

    it("should return false", () => {
      expect(isPwa()).toBe(false);
    });
  });

  describe("when in a PWA (not Safari)", () => {
    beforeEach(() => {
      when(matchMedia)
        .calledWith("(display-mode: standalone)")
        .mockReturnValue(({ matches: true } as Partial<
          MediaQueryList
        >) as MediaQueryList);
      Object.assign(navigator, { standalone: undefined });
    });

    it("should return true", () => {
      expect(isPwa()).toBe(true);
    });
  });

  describe("when in a PWA (Safari)", () => {
    beforeEach(() => {
      when(matchMedia)
        .calledWith("(display-mode: standalone)")
        .mockReturnValue(({ matches: false } as Partial<
          MediaQueryList
        >) as MediaQueryList);
      Object.assign(navigator, { standalone: true });
    });

    it("should return true", () => {
      expect(isPwa()).toBe(true);
    });
  });
});
