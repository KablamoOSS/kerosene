import { parse } from "content-type";

export type CreateTransformOptions = {
  defaultTransform?: (res: Response) => Promise<unknown>;
};

/**
 * Takes a fetch response and attempts to transform the response automatically according to the status code and
 * Content-Type header (if provided)
 * @param response
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

export const transformDefaultJson = createTransform({
  defaultTransform: (response) => response.json(),
});

const transform = createTransform();

export default transform;
