/**
 * Returns the cartesian product of the source arrays
 *
 * Usage:
 * ```typescript
 * product([1, 2], [3, 4]); // [[1, 3], [1, 4], [2, 3], [2, 4]]
 * ```
 *
 * @param sources
 */
export default function product<T>(...sources: T[][]): T[][] {
  return sources.reduce(
    (acc, current) =>
      acc.flatMap(list => current.map(item => list.concat([item]))),
    [[]] as T[][],
  );
}
