import getViewportDimensions from "./getViewportDimensions";

/**
 * Returns whether or not a given `element` is within the current viewport
 * @param element
 */
export default function isInViewport(element: Element): boolean {
  const { top, left, bottom, right } = element.getBoundingClientRect();
  const { height, width } = getViewportDimensions();

  return bottom >= 0 && right >= 0 && top <= height && left <= width;
}
