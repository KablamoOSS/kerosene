import createSandbox from "jest-sandbox";
import { when } from "jest-when";
import { getSafeAreaInsets } from "./getSafeAreaInsets";

const element = ({
  tagName: "div",
  style: {},
} as Partial<HTMLElement>) as HTMLElement;

describe("getSafeAreaInsets", () => {
  let sandbox: JestSandbox;
  let createElement: jest.Mock<
    ReturnType<typeof document.createElement>,
    Parameters<typeof document.createElement>
  >;
  let appendChild: jest.Mock<
    ReturnType<typeof document.body.appendChild>,
    Parameters<typeof document.body.appendChild>
  >;
  let getComputedStyle: jest.Mock<
    ReturnType<typeof window.getComputedStyle>,
    Parameters<typeof window.getComputedStyle>
  >;
  beforeEach(() => {
    sandbox = createSandbox();
    createElement = jest.fn();
    document.createElement = createElement;
    when(createElement)
      .calledWith("div")
      .mockReturnValue(element);
    appendChild = jest.fn();
    document.body.appendChild = appendChild as typeof document.body.appendChild;
    getComputedStyle = jest.fn();
    window.getComputedStyle = getComputedStyle;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return an object containing the insets", () => {
    when(getComputedStyle)
      .calledWith(element)
      .mockReturnValue(({
        top: "21px",
        left: "44px",
        bottom: "21px",
        right: "44px",
      } as Partial<CSSStyleDeclaration>) as CSSStyleDeclaration);

    expect(getSafeAreaInsets()).toEqual({
      top: 21,
      left: 44,
      bottom: 21,
      right: 44,
    });
    getSafeAreaInsets();

    const testDiv = appendChild.mock.calls[0][0] as HTMLDivElement;
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
      .mockReturnValue(({} as Partial<
        CSSStyleDeclaration
      >) as CSSStyleDeclaration);

    expect(getSafeAreaInsets()).toEqual({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });
  });
});
