// @vitest-environment jsdom

import type { Mock } from "vitest";
import { when } from "vitest-when";
import getSafeAreaInsets from "./getSafeAreaInsets";

const element = {
  tagName: "div",
  style: {},
} as Partial<HTMLElement> as HTMLElement;

describe("getSafeAreaInsets", () => {
  let createElement: Mock<typeof document.createElement>;
  let appendChild: Mock<typeof document.body.appendChild>;
  let getComputedStyle: Mock<typeof window.getComputedStyle>;
  beforeEach(() => {
    createElement = vi.fn();
    document.createElement = createElement;
    when(createElement).calledWith("div").thenReturn(element);
    appendChild = vi.fn();
    document.body.appendChild = appendChild as typeof document.body.appendChild;
    getComputedStyle = vi.fn();
    window.getComputedStyle = getComputedStyle;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return an object containing the insets", () => {
    when(getComputedStyle)
      .calledWith(element)
      .thenReturn({
        top: "21px",
        left: "44px",
        bottom: "21px",
        right: "44px",
      } as Partial<CSSStyleDeclaration> as CSSStyleDeclaration);

    expect(getSafeAreaInsets()).toEqual({
      top: 21,
      left: 44,
      bottom: 21,
      right: 44,
    });
    getSafeAreaInsets();

    const testDiv = appendChild.mock.calls[0]![0] as HTMLDivElement;
    expect(testDiv.style).toEqual({
      pointerEvents: "none",
      top: "env(safe-area-inset-top, 0px)",
      left: "env(safe-area-inset-left, 0px)",
      bottom: "env(safe-area-inset-bottom, 0px)",
      right: "env(safe-area-inset-right, 0px)",
    });
  });

  it("should return insets as 0 if the styles can't be computed", () => {
    when(getComputedStyle)
      .calledWith(element)
      .thenReturn({} as Partial<CSSStyleDeclaration> as CSSStyleDeclaration);

    expect(getSafeAreaInsets()).toEqual({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });
  });
});
