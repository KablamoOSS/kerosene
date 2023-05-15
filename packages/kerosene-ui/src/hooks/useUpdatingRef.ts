import * as React from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

/**
 * Custom hook which creates a ref to the `value` which is kept up-to-date after each render in `useLayoutEffect`
 * @param value
 */
export default function useUpdatingRef<T>(value: T): React.RefObject<T> {
  const ref = React.useRef(value);

  // NOTE: This must occur in an effect, as writing to a ref during the render phase can lead to unexpected consequences
  // during concurrent rendering. Writing _and reading_ to a ref during render is banned, except during initialization.
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
