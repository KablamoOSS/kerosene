/**
 * Regex to match the error message for Network Errors thrown by `fetch()`
 *
 * Different browsers have different messages as follows:
 * - Chrome/Opera: Failed to fetch
 * - Firefox/Edge: NetworkError
 * - Safari: Network error
 * - Fetch polyfill: Network request failed
 */
const NETWORK_ERROR_MESSAGE_REGEX = /Failed to fetch|NetworkError|Network error|Network request failed/i;

/**
 * Returns whether or not `error` is a fetch() Network Error, accounting for browser differences
 *
 * Note: This will trigger false-positives for CORS errors as there is no cross-browser way to detect a CORS error
 *
 * @param error
 */
export function isNetworkError(error: unknown) {
  return (
    error instanceof TypeError &&
    NETWORK_ERROR_MESSAGE_REGEX.test(error.message)
  );
}
