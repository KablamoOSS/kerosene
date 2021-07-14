// Using default import here due to faulty ESBuild polyfills with named exports
import qs from "querystring";

/**
 * Parse query parameters from Location.search
 *
 * @deprecated Use builtin `URLSearchParams(search)` instead
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 * @see https://nodejs.org/api/url.html#url_class_urlsearchparams
 *
 * @param search Location.search
 */
export default function parseSearch(search: string) {
  const [, querystring = ""] = search.split("?", 2);
  return qs.parse(querystring);
}
