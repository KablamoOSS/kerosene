export default function product(): [[]];

export default function product<T1>(source1: readonly T1[]): [T1][];

export default function product<T1, T2>(
  source1: readonly T1[],
  source2: readonly T2[],
): [T1, T2][];

export default function product<T1, T2, T3>(
  source1: readonly T1[],
  source2: readonly T2[],
  source3: readonly T3[],
): [T1, T2, T3][];

export default function product<T1, T2, T3, T4>(
  source1: readonly T1[],
  source2: readonly T2[],
  source3: readonly T3[],
  source4: readonly T4[],
): [T1, T2, T3, T4][];

export default function product<T1, T2, T3, T4, T5>(
  source1: readonly T1[],
  source2: readonly T2[],
  source3: readonly T3[],
  source4: readonly T4[],
  source5: readonly T5[],
): [T1, T2, T3, T4, T5][];

export default function product<T>(...sources: ReadonlyArray<T>[]): T[][];

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
export default function product<T>(...sources: ReadonlyArray<T>[]): T[][] {
  return sources.reduce(
    (acc, current) =>
      acc.flatMap(list => current.map(item => list.concat([item]))),
    [[]] as T[][],
  );
}
