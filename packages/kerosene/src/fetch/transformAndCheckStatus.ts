import transform from "./transform";

/**
 * Transforms the response, rejecting if the status is not 2xx
 * @param response
 */
export default function transformAndCheckStatus(
  response: Response,
): Promise<unknown> {
  return transform(response).then(transformed => {
    if (response.status >= 200 && response.status < 300) return transformed;

    throw Object.assign(new Error(response.statusText), {
      status: response.status,
      response: transformed,
    });
  });
}
