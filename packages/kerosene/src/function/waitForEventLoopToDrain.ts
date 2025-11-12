import globalThis from "core-js-pure/features/global-this";

// Grab a reference to the global `setImmediate` and `setTimeout` so mocking libraries like `sinon` don't interfere
const { setImmediate, setTimeout } = globalThis;

/**
 * Returns a Promise that resolves when the event loop has drained
 *
 * This can be useful in unit testing where you need to wait for `Promise` to resolve but you do
 * not have access to it (i.e. it isn't returned, such as in `useEffect()` in React)
 *
 * NOTE: This function uses its own reference to the global `setImmediate` so mocking libraries
 * like `sinon` do not replace the internal `setImmediate` used to wait for the event loop to drain
 */
export default function waitForEventLoopToDrain(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (setImmediate) {
      setImmediate(resolve);
    } else if (
      // @ts-expect-error TS2708: Needed without @types/jest
      typeof jest !== "undefined" &&
      // @ts-expect-error TS2708: Needed without @types/jest
      typeof jest.requireActual === "function"
    ) {
      // jest-environment-jsdom removes `setImmediate` from the Node globals, so instead use jest to require the Node
      // API from the "timers" module. We can't just do `import { setImmediate } from "timers";` because of the browser
      const requireTimers: (moduleName: "timers") => typeof import("timers") =
        // @ts-expect-error TS2708: Needed without @types/jest
        jest.requireActual;
      requireTimers("timers").setImmediate(resolve);
    } else {
      // Fallback to setTimeout
      setTimeout(resolve, 0);
    }
  });
}
