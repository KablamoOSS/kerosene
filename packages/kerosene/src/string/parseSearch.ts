import * as qs from "querystring";
/**
 * Parse query parameters from Location.search
 * @param search Location.search
 */
export default function parseSearch(search: string) {
  const [, querystring = ""] = search.split("?", 2);
  return qs.parse(querystring);
}
