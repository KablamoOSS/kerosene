import * as React from "react";
import rafThrottle from "../utils/rafThrottle";

/**
 * Custom hook for throttling a callback with `requestAnimationFrame`.
 * `cancelAnimationFrame` will automatically be called on component unmount.
 *
 * @param callback
 */
export default function useRafThrottle<T extends any[]>(
  callback: (...args: T) => void,
) {
  const cb = React.useRef(callback);

  React.useEffect(() => {
    cb.current = callback;
  }, [callback]);

  const throttled = React.useMemo(
    () => rafThrottle((...args: T) => cb.current(...args)),
    [],
  );

  React.useEffect(() => () => throttled.cancel(), [throttled]);

  return throttled;
}
