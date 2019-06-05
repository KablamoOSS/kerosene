import { when } from "jest-when";
import getViewportDimensions from "./getViewportDimensions";

const MOBILE_SAFARI_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1";
const DESKTOP_SAFARI_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15";

const _matchMedia = jest.fn() as jest.Mock<
  ReturnType<typeof window.matchMedia>,
  Parameters<typeof window.matchMedia>
>;
window.matchMedia = _matchMedia;

describe("getViewportDimensions", () => {
  describe("when the userAgent is mobile safari", () => {
    beforeEach(() => {
      Object.assign(navigator, { standalone: undefined });
      Object.defineProperty(navigator, "userAgent", {
        get: () => MOBILE_SAFARI_USER_AGENT,
        configurable: true,
      });
      Object.defineProperties(screen, {
        height: { get: () => 896, configurable: true },
        width: { get: () => 414, configurable: true },
      });
    });

    it("should return the screen dimensions in portrait", () => {
      Object.assign(navigator, { standalone: true });
      when(_matchMedia)
        .calledWith("(orientation: portrait)")
        .mockReturnValue(({ matches: true } as Partial<
          MediaQueryList
        >) as MediaQueryList);

      expect(getViewportDimensions()).toEqual({
        height: 896,
        width: 414,
      });
    });

    it("should return the screen dimensions in landscape", () => {
      Object.assign(navigator, { standalone: true });
      when(_matchMedia)
        .calledWith("(orientation: portrait)")
        .mockReturnValue(({ matches: false } as Partial<
          MediaQueryList
        >) as MediaQueryList);

      expect(getViewportDimensions()).toEqual({
        height: 414,
        width: 896,
      });
    });

    it("should return window.innerHeight, window.innerWidth", () => {
      Object.assign(navigator, { standalone: false });
      expect(getViewportDimensions()).toEqual({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    });
  });

  [
    {
      name: "desktop safari",
      userAgent: DESKTOP_SAFARI_USER_AGENT,
    },
    { name: "anything else", userAgent: "node.js" },
  ].forEach(({ name, userAgent }) => {
    it(`should return the window dimensions when the useragent is ${name}`, () => {
      Object.defineProperty(navigator, "userAgent", { get: () => userAgent });
      Object.assign(window, {
        innerHeight: 414,
        innerWidth: 896,
      });
      expect(getViewportDimensions()).toEqual({
        height: 414,
        width: 896,
      });
    });
  });
});
