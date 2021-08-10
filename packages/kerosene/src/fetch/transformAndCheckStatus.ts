import ClientError from "./clientError";
import HttpError from "./httpError";
import ServerError from "./serverError";
import transform from "./transform";

/**
 * Transforms the response, rejecting if the status is not 2xx
 * @param response
 */
export default function transformAndCheckStatus(
  response: Response,
): Promise<unknown> {
  return transform(response).then((transformed) => {
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
