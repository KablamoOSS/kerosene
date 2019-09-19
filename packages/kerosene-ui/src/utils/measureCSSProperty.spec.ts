import createSandbox from "jest-sandbox";
import { when } from "jest-when";
import measureCSSProperty from "./measureCSSProperty";
import { JestMock } from "../../../kerosene-test/src";

describe("measureCSSProperty", () => {
  let sandbox: JestSandbox;
  let createElement: JestMock<Document["createElement"]>;
  let getComputedStyle: JestMock<Window["getComputedStyle"]>;
  beforeEach(() => {
    sandbox = createSandbox();
    createElement = jest.fn();
    document.createElement = createElement;
    getComputedStyle = jest.fn();
    window.getComputedStyle = getComputedStyle;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should inject a noscript tag and return the computed style", () => {
    const el = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    };

    const noscript = { tagName: "NOSCRIPT", style: {} } as HTMLElement;
    when(createElement)
      .calledWith("noscript")
      .mockReturnValue(noscript);

    when(getComputedStyle)
      .calledWith({
        ...noscript,
        style: { ...noscript.style, paddingTop: "var(--header-height, 0px)" },
      } as HTMLElement)
      .mockReturnValue({ paddingTop: "48px" } as CSSStyleDeclaration);

    expect(
      measureCSSProperty(
        (el as Partial<Element>) as Element,
        "paddingTop",
        "var(--header-height, 0px)",
      ),
    ).toBe("48px");
    expect(el.appendChild).toBeCalledWith(noscript);
    expect(noscript.style).toHaveProperty(
      ["paddingTop"],
      "var(--header-height, 0px)",
    );
    expect(el.removeChild).toBeCalledWith(noscript);
  });
});
