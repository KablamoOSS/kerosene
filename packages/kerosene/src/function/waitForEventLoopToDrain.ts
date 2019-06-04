import globalThis from "core-js-pure/features/global-this";

// Grab a reference to the global `setImmediate` so mocking libraries like `sinon` don't interfere
const { setImmediate } = globalThis;

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
  return new Promise<void>(resolve => setImmediate(resolve));
}
