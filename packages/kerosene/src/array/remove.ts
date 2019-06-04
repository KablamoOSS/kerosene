export default function remove<T>(needle: T, haystack: T[]): T[] {
  return haystack.filter(item => item !== needle);
}
