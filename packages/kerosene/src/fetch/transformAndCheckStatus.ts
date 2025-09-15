import ClientError from "./clientError";
import HttpError from "./httpError";
import ServerError from "./serverError";
import { createTransform, type CreateTransformOptions } from "./transform";

/**
 * Create a handler for parsing fetch responses, using the status code and Content-Type header if provided, and falling back to an option custom transform if not. This is only necessary if you want to provide a defaultTransform for `transformAndCheckStatus` different to the existing behaviour
 * @param options
 */
export function createTransformAndCheckStatus(
  options: CreateTransformOptions = {},
) {
  return <T = unknown>(response: Response): Promise<T> => {
    const transformHandler = createTransform(options);

    return transformHandler(response).then((transformed) => {
      if (response.status >= 200 && response.status < 300) return transformed;

      if (response.status >= 400 && response.status < 500) {
        throw new ClientError(
          response.statusText,
          response.status,
          transformed,
        );
      }

      if (response.status >= 500 && response.status < 600) {
        throw new ServerError(
          response.statusText,
          response.status,
          transformed,
        );
      }

      throw new HttpError(response.statusText, response.status, transformed);
    });
  };
}

/**
 * Takes a fetch response and attempts to transform the response automatically according to the status code and
 * Content-Type header (if provided), falling back to the JSON response if a matching type is not found
 * @param response
 */
export const transformAndCheckStatusDefaultJson = createTransformAndCheckStatus(
  { defaultTransform: (response) => response.json() },
);

/**
 * Takes a fetch response and attempts to transform the response automatically according to the status code and
 * Content-Type header (if provided)
 * @param response
 */
const transformAndCheckStatus = createTransformAndCheckStatus();

export default transformAndCheckStatus;
