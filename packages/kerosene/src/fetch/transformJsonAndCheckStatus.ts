import ClientError from "./clientError";
import HttpError from "./httpError";
import ServerError from "./serverError";
import transform from "./transform";

/**
 * Transforms the response, rejecting if the status is not 2xx
 * @param response
 */
export default function transformAndCheckStatus<T = unknown>(
  response: Response,
): Promise<T | null> {
  return transform(response).then(async (originalTransformed) => {
    // 204 statuses return null in the original transform, so keep that behaviour here
    if (originalTransformed === null) return originalTransformed;

    // Otherwise we use .json directly, to avoid incorrect transformations when Content-Type is missing
    const transformed = await response.json();

    if (response.status >= 200 && response.status < 300) return transformed;

    if (response.status >= 400 && response.status < 500) {
      throw new ClientError(response.statusText, response.status, transformed);
    }

    if (response.status >= 500 && response.status < 600) {
      throw new ServerError(response.statusText, response.status, transformed);
    }

    throw new HttpError(response.statusText, response.status, transformed);
  });
}
