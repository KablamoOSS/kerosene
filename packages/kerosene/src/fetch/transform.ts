import { parse } from "content-type";

export type CreateTransformOptions = {
  defaultTransform?: (res: Response) => Promise<unknown>;
};

/**
 * Create a handler for parsing fetch responses, using the status code and Content-Type header if provided, and falling back to an option custom transform if not. This is only necessary if you want to provide a defaultTransform for `transform` different to the existing behaviour
 * @param options

 */
export function createTransform({
  defaultTransform,
}: CreateTransformOptions = {}) {
  return (response: Response) => {
    if (response.status === 204) {
      return Promise.resolve(null);
    }

    const contentType = response.headers.get("Content-Type");

    if (!contentType) {
      return defaultTransform ? defaultTransform(response) : response.text();
    }

    const { type } = parse(contentType);

    switch (type) {
      case "application/json":
        return response.json();

      case "text/plain":
        return response.text();

      default:
        return defaultTransform ? defaultTransform(response) : response.blob();
    }
  };
}

/**
 * Takes a fetch response and attempts to transform the response automatically according to the status code and
 * Content-Type header (if provided), falling back to the JSON response if a matching type is not found
 * @param response
 */
export const transformDefaultJson = createTransform({
  defaultTransform: (response) => response.json(),
});

/**
 * Takes a fetch response and attempts to transform the response automatically according to the status code and
 * Content-Type header (if provided)
 * @param response
 */
const transform = createTransform();

export default transform;
