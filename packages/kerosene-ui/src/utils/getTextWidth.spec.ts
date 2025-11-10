import createSandbox from "jest-sandbox";
import { when } from "jest-when";
import getTextWidth from "./getTextWidth";

const font = {
  family: "FontFamily",
  size: "13px",
};
const text = "$2,000.00";
const width = 67;

describe("#getTextWidth", () => {
  let sandbox: JestSandbox;
  let createElement: jest.Mock<
    ReturnType<typeof document.createElement>,
    Parameters<typeof document.createElement>
  >;
  let getContext: jest.Mock<
    ReturnType<HTMLCanvasElement["getContext"]>,
    Parameters<HTMLCanvasElement["getContext"]>
  >;
  let setFont: jest.Mock<void, [string]>;
  let measureText: jest.Mock<
    ReturnType<CanvasRenderingContext2D["measureText"]>,
    Parameters<CanvasRenderingContext2D["measureText"]>
  >;
  beforeEach(() => {
    sandbox = createSandbox();
    setFont = sandbox.fn();
    measureText = sandbox.fn();
    getContext = sandbox.fn();
    getContext.mockReturnValue(null);
    createElement = sandbox.fn();
    document.createElement = createElement;
    when(createElement)
      .calledWith("canvas")
      .mockReturnValue({
        getContext,
      } as Partial<HTMLCanvasElement> as HTMLCanvasElement);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should calculate the width of the text re-using a canvas element", () => {
    when(getContext)
      .calledWith("2d", { alpha: false })
      .mockReturnValue({
        set font(value: string) {
          setFont(value);
        },
        measureText,
      } as Partial<CanvasRenderingContext2D> as CanvasRenderingContext2D);
    when(measureText)
      .calledWith(text)
      .mockReturnValue({
        width,
      } as Partial<TextMetrics> as TextMetrics);

    expect(getTextWidth(text, font)).toBe(width);
    expect(getTextWidth(text, font)).toBe(width);
    expect(setFont).toHaveBeenCalledWith("13px FontFamily");
  });

  it("should fall back to font.size * text.length when the canvas context is not available", () => {
    expect(getTextWidth(text, font)).toBe(13 * text.length);
  });
});
