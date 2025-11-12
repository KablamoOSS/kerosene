// @vitest-environment jsdom

import type { Mock } from "vitest";
import { when } from "vitest-when";
import getTextWidth from "./getTextWidth";

const font = {
  family: "FontFamily",
  size: "13px",
};
const text = "$2,000.00";
const width = 67;

describe("#getTextWidth", () => {
  let createElement: Mock<typeof document.createElement>;
  let getContext: Mock<HTMLCanvasElement["getContext"]>;
  let setFont: Mock<(font: string) => void>;
  let measureText: Mock<CanvasRenderingContext2D["measureText"]>;
  beforeEach(() => {
    setFont = vi.fn();
    measureText = vi.fn();
    getContext = vi.fn();
    getContext.mockReturnValue(null);
    createElement = vi.fn();
    document.createElement = createElement;
    when(createElement)
      .calledWith("canvas")
      .thenReturn({
        getContext,
      } as Partial<HTMLCanvasElement> as HTMLCanvasElement);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should calculate the width of the text re-using a canvas element", () => {
    when(getContext)
      .calledWith("2d", { alpha: false })
      .thenReturn({
        set font(value: string) {
          setFont(value);
        },
        measureText,
      } as Partial<CanvasRenderingContext2D> as CanvasRenderingContext2D);
    when(measureText)
      .calledWith(text)
      .thenReturn({
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
