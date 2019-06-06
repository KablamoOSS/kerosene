import { noop } from "lodash";
import * as React from "react";

/**
 * Custom React Hook that makes `setInterval` work declaratively with hooks
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback
 * @param delay
 */
export default function useInterval(
  callback: () => void,
  delay: number | null,
) {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  React.useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return noop;
  }, [delay]);
}
