// @vitest-environment jsdom

import type { Mock } from "vitest";
import { when } from "vitest-when";
import isPwa from "./isPwa";

describe("#isPwa", () => {
  let matchMedia: Mock<typeof window.matchMedia>;
  beforeEach(() => {
    matchMedia = vi.fn();
    matchMedia.mockImplementation(() => {
      throw new Error("matchMedia was called with incorrect args");
    });
    window.matchMedia = matchMedia;
  });

  afterEach(() => {
    matchMedia.mockRestore();
  });

  describe("when not in a PWA (not Safari)", () => {
    beforeEach(() => {
      when(matchMedia)
        .calledWith("(display-mode: standalone)")
        .thenReturn({
          matches: false,
        } as Partial<MediaQueryList> as MediaQueryList);
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
        .thenReturn({
          matches: false,
        } as Partial<MediaQueryList> as MediaQueryList);
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
        .thenReturn({
          matches: true,
        } as Partial<MediaQueryList> as MediaQueryList);
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
        .thenReturn({
          matches: false,
        } as Partial<MediaQueryList> as MediaQueryList);
      Object.assign(navigator, { standalone: true });
    });

    it("should return true", () => {
      expect(isPwa()).toBe(true);
    });
  });
});
