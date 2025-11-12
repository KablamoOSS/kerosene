// @vitest-environment jsdom

import type { Mock } from "vitest";
import { when } from "vitest-when";
import measureCSSProperty from "./measureCSSProperty";

describe("measureCSSProperty", () => {
  let createElement: Mock<Document["createElement"]>;
  let getComputedStyle: Mock<Window["getComputedStyle"]>;
  beforeEach(() => {
    createElement = vi.fn();
    document.createElement = createElement;
    getComputedStyle = vi.fn();
    window.getComputedStyle = getComputedStyle;
  });

  afterEach(() => {
    createElement.mockRestore();
  });

  it("should inject a noscript tag and return the computed style", () => {
    const el = {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    };

    const noscript = { tagName: "NOSCRIPT", style: {} } as HTMLElement;
    when(createElement).calledWith("noscript").thenReturn(noscript);

    when(getComputedStyle)
      .calledWith({
        ...noscript,
        style: { ...noscript.style, paddingTop: "var(--header-height, 0px)" },
      } as HTMLElement)
      .thenReturn({ paddingTop: "48px" } as CSSStyleDeclaration);

    expect(
      measureCSSProperty(
        el as Partial<Element> as Element,
        "paddingTop",
        "var(--header-height, 0px)",
      ),
    ).toBe("48px");
    expect(el.appendChild).toHaveBeenCalledWith(noscript);
    expect(noscript.style).toHaveProperty(
      ["paddingTop"],
      "var(--header-height, 0px)",
    );
    expect(el.removeChild).toHaveBeenCalledWith(noscript);
  });
});
