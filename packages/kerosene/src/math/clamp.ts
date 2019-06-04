/**
 * Returns a value clamped between min and max
 *
 * Similar to the CSS `clamp()` function, this is resolved as `Math.max(min, Math.min(value, max))`
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
 *
 * @param min
 * @param value
 * @param max
 */
export default function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(value, max));
}
