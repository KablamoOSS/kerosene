import transform from "./transform";

declare global {
  interface Error {
    /**
     * Response status code
     */
    status?: number;
    /**
     * Transformed response
     */
    response?: any;
  }
}

/**
 * Transforms the response, rejecting if the status is not 2xx
 * @param response
 */
export default function transformAndCheckStatus(
  response: Response,
): Promise<unknown> {
  return transform(response).then(transformed => {
    if (response.status >= 200 && response.status < 300) return transformed;

    const error = new Error(response.statusText);
    error.status = response.status;
    error.response = transformed;

    throw error;
  });
}
