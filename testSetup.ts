import "@testing-library/jest-dom";
import "core-js/features/promise/with-resolvers";
import "core-js/features/set/is-disjoint-from";
import noop from "lodash/noop";
import { setImmediate } from "timers";

// Required for Jest 27
global.setImmediate = setImmediate;

const CSS = class CSS {
  private constructor() {
    throw new TypeError("CSS is not a constructor");
  }

  public static [Symbol.toStringTag] = "CSS";

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CSS/supports) */
  public static supports(property: string, value: string): boolean;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CSS/supports) */
  public static supports(conditionText: string): boolean;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CSS/supports) */
  public static supports(conditionOrProperty: string, value?: string): boolean {
    const details = [conditionOrProperty, value]
      .filter((arg) => !!arg)
      .join(",");
    throw new Error(`Not implemented${details && `: `}${details}`);
  }
} satisfies Partial<typeof globalThis.CSS>;
Object.assign(globalThis, { CSS });

// NOTE: Including this to prevent noisy console logs from ErrorBoundary components. Even though the ErrorBoundary
// catches the errors, React still logs these to the console unless, `e.defaultPrevented` is `true`
window.addEventListener("error", (e) => {
  e.preventDefault();
});

Object.assign(window, {
  matchMedia: ((query) => ({
    get matches(): boolean {
      throw new Error("Not Implemented");
    },
    media: query,
    dispatchEvent: () => true,
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    onchange: null,
  })) satisfies Window["matchMedia"],
  requestAnimationFrame: (callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 17),
  cancelAnimationFrame: (handle: number) => clearTimeout(handle),
});
