import * as React from "react";
import mergeRefs from "../utils/mergeRefs";

/**
 * Custom hook which creates a new callback ref that effectively merges all provided `refs`
 * @param refs
 */
export default function useMergedRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(mergeRefs(...refs), refs);
}
