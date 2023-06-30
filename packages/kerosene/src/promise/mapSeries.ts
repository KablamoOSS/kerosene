/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */

/**
 * Maps over `items` with a promise-returning `iteratee` in series
 * @param items
 * @param iteratee
 */
export default function mapSeries<TItems extends any[], U>(
  items: readonly [...TItems],
  iteratee: (
    value: TItems[number],
    index: number,
    array: Readonly<TItems>,
  ) => Promise<U>,
): Promise<{ [Index in keyof TItems]: U }> {
  return items.reduce(
    (acc, item, index, array) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      acc.then((previous) =>
        iteratee(item, index, array as TItems).then((result) => [
          ...previous,
          result,
        ]),
      ),
    Promise.resolve([] as U[] as { [Index in keyof TItems]: U }),
  );
}
