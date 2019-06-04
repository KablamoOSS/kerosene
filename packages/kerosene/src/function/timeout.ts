/**
 * Resolves after the specified delay
 * @param delay Delay in milliseconds
 */
export default function timeout(delay: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, delay));
}
