import identity from "lodash/identity";

export interface FontDetails {
  family: string;
  size: string;
  style?: string;
  weight?: string;
}

let TEST_CANVAS: HTMLCanvasElement | null = null;

/**
 * Calculates the width of the provided text with 2D Canvas
 * @param text
 * @param font Font Details
 */
export default function getTextWidth(text: string, font: FontDetails) {
  if (!TEST_CANVAS) {
    TEST_CANVAS = document.createElement("canvas");
  }

  const context = TEST_CANVAS.getContext("2d", { alpha: false });

  if (!context) return text.length * parseInt(font.size, 10);

  context.font = (
    [font.style, font.weight, font.size, font.family].filter(
      identity,
    ) as string[]
  ).join(" ");
  return Math.ceil(context.measureText(text).width);
}
