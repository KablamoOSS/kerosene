import { parse } from "content-type";

/**
 * Takes a fetch response and attempts to transform the response automatically according to the status code and
 * Content-Type header (if provided)
 * @param response
 */
export default function transform(response: Response) {
  if (response.status === 204) {
    return Promise.resolve(null);
  }

  const contentType = response.headers.get("Content-Type");

  if (!contentType) {
    return response.text();
  }

  const { type } = parse(contentType);

  switch (type) {
    case "application/json":
      return response.json();

    case "application/pdf":
      return response.blob();

    case "text/plain":
    default:
      return response.text();
  }
}
