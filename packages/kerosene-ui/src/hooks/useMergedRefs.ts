import * as React from "react";
import mergeRefs from "../utils/mergeRefs";

/**
 * Custom hook which creates a new callback ref that effectively merges all provided `refs`.
 *
 * Note: React 19 callback refs with cleanup are not supported as this is impossible without library support.
 * @see https://github.com/facebook/react/issues/29757
 *
 * @param refs
 */
export default function useMergedRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(mergeRefs(...refs), refs);
}
