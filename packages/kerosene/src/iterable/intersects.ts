/**
 * Returns whether any elements are shared between `iterable1` and `iterable2`.
 *
 * NOTE: Requires `Set#isDisjointFrom()` to be present. May need to be polyfilled.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isDisjointFrom
 *
 * @param iterable1
 * @param iterable2
 */
export default function intersects<T>(
  iterable1: Iterable<T>,
  iterable2: Iterable<T>,
): boolean {
  const isDisjoint = new Set(iterable1).isDisjointFrom(new Set(iterable2));
  return !isDisjoint;
}
