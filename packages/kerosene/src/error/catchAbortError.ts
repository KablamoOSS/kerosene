import isAbortError from "./isAbortError";

/**
 * Function that will re-throw any non-AbortError.
 * @example
 * ```ts
 * timeout(1_000, { signal }).then(doSomething, catchAbortError);
 * ```
 *
 * @param error
 */
export default function catchAbortError(error: unknown): void {
  if (!isAbortError(error)) {
    throw error;
  }
}
