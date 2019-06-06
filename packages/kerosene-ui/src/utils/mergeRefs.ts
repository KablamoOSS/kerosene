import { Mutable } from "@kablamo/kerosene";

/**
 * Returns a new callback ref that effectively merges all provided `refs`
 * @param refs
 */
export default function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (instance: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        (ref as Mutable<typeof ref>).current = instance;
      }
    });
  };
}
