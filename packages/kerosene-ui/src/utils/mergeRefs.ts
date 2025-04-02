import type { Mutable } from "@kablamo/kerosene";

/**
 * Returns a new callback ref that effectively merges all provided `refs`
 *
 * Note: React 19 callback refs with cleanup are not supported as this is impossible without library support.
 * @see https://github.com/facebook/react/issues/29757
 *
 * @param refs
 */
export default function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        const result = ref(instance);

        if (typeof result === "function") {
          throw new Error(
            "mergeRefs() does not support callback refs with cleanup. See https://github.com/facebook/react/issues/29757",
          );
        }
      } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        (ref as Mutable<typeof ref>).current = instance;
      }
    });
  };
}
