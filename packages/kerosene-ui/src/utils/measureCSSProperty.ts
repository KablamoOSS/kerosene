/**
 * Measures a CSS `property` at the provided `element` by injecting a `<noscript />` element and setting the style
 * `property` to `value` and measuring with `window.getComputedStyle`.
 *
 * Useful for measuring CSS Custom Properties that contain calc expressions, e.g.
 *
 * ```css
 * :root {
 *   --header-height: 48px;
 * }
 *
 * @media only screen and (min-width: 768px) {
 *   :root {
 *     --header-height: 72px;
 *   }
 * }
 * ```
 *
 * ```typescript
 * const headerHeight = measureCSSProperty(document.body, "paddingTop", "var(--header-height, 0px)");
 * ```
 *
 * @param element
 * @param property
 * @param value
 */
export default function measureCSSProperty<P extends keyof CSSStyleDeclaration>(
  element: Element,
  property: P,
  value: CSSStyleDeclaration[P],
): CSSStyleDeclaration[P] {
  const noscript = document.createElement("noscript");
  noscript.style[property] = value;
  element.appendChild(noscript);
  const computed = window.getComputedStyle(noscript)[property];
  element.removeChild(noscript);
  return computed;
}
