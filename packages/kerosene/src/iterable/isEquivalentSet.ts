import isEqual from "lodash/isEqual";

/**
 * Returns whether `iterable1` is an equivalent set to `iterable2`
 * @param iterable1
 * @param iterable2
 */
export default function isEquivalentSet<T>(
  iterable1: Iterable<T>,
  iterable2: Iterable<T>,
): boolean {
  return (
    iterable1 === iterable2 || isEqual(new Set(iterable1), new Set(iterable2))
  );
}
