/**
 * @deprecated Use builtin `URLSearchParams` instead
 */
type ParsedUrlQuery = NodeJS.Dict<string | string[]>;

/**
 * Parse query parameters from Location.search
 *
 * @deprecated Use builtin `URLSearchParams(search)` instead
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 * @see https://nodejs.org/api/url.html#url_class_urlsearchparams
 *
 * @param search Location.search
 */
export default function parseSearch(search: string): ParsedUrlQuery {
  const searchParams = new URLSearchParams(search);
  const parsed: ParsedUrlQuery = Object.create(null);
  searchParams.forEach((value, key) => {
    if (typeof parsed[key] === "undefined") {
      parsed[key] = value;
    } else if (Array.isArray(parsed[key])) {
      parsed[key].push(value);
    } else {
      parsed[key] = [parsed[key], value];
    }
  });
  return parsed;
}
