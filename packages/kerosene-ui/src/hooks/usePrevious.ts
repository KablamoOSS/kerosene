import * as React from "react";

export default function usePrevious<T>(
  value: T,
  initialValue?: undefined,
): T | undefined;

export default function usePrevious<T, U>(value: T, initialValue: U): T | U;

/**
 * Custom hook which remembers the value from the previous render
 * @param value
 * @param initialValue
 */
export default function usePrevious<T, U>(value: T, initialValue: U): T | U {
  const ref = React.useRef<T | U>(initialValue);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
