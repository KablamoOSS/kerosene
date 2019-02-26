import { identity } from "lodash";

export default function contains<T>(superset: T[], subset: T[], iteratee: (i: T) => any = identity) {
  if (superset === subset) {
    return true;
  }

  const mappedSubset = subset.map(iteratee);
  const mappedSuperset = superset.map(iteratee);

  return mappedSubset.every((value) => {
    return mappedSuperset.includes(value);
  });
}
