export default function remove<T>(needle: T, haystack: readonly T[]): T[] {
  return haystack.filter(item => item !== needle);
}
