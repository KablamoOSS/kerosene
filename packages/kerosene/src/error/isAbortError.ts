import { isRecord } from "../types";

/**
 * Returns whether the provided `error` is an `"AbortError"` by `name`
 * @param error
 */
export default function isAbortError(
  error: unknown,
): error is Record<PropertyKey, unknown> & { name: "AbortError" } {
  return isRecord(error) && error.name === "AbortError";
}
