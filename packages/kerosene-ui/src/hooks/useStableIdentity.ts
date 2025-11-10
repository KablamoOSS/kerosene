import _isEqual from "lodash/isEqual";
import * as React from "react";

/**
 * Custom hook which provides a stable identity between renders for `value` which is equal to the previous value
 * according to the `isEqual` function
 * @param value
 * @param isEqual
 */
export default function useStableIdentity<T>(
  value: T,
  isEqual: (value: T, other: T) => boolean = _isEqual,
): T {
  // Using the initializer function so that `value` can itself be a function
  const [reference, setReference] = React.useState(() => value);

  // First perform a shallow check with `Object.is()` for performance, then use custom `isEqual`
  if (!Object.is(value, reference) && !isEqual(value, reference)) {
    // Conditionally dispatching a state update as part of a render will cause the component to re-render synchronously
    // NOTE: Using the updater function variant so that `value` itself can be a function
    setReference(() => value);

    // Allow the new value to be used immediately as part of this render
    return value;
  }

  // Use the previous reference to a value so that its identity remains the same
  return reference;
}
