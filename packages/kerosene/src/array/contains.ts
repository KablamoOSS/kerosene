import identity from "lodash/identity";

export default function contains<T>(
  superset: readonly T[],
  subset: readonly T[],
  iteratee: (i: T) => unknown = identity,
) {
  if (superset === subset) {
    return true;
  }

  const mappedSubset = subset.map(iteratee);
  const mappedSuperset = superset.map(iteratee);

  return mappedSubset.every((value) => {
    return mappedSuperset.includes(value);
  });
}
