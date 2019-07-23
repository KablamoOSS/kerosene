import remove from "./remove";

export default function toggle<T>(needle: T, haystack: readonly T[]): T[] {
  if (haystack.includes(needle)) {
    return remove(needle, haystack);
  } else {
    return [...haystack, needle];
  }
}
