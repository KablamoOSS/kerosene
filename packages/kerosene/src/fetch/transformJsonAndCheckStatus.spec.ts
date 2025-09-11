import { when } from "jest-when";
import ClientError from "./clientError";
import HttpError from "./httpError";
import ServerError from "./serverError";
import _transform from "./transform";
import transformJsonAndCheckStatus from "./transformJsonAndCheckStatus";

jest.mock("./transform");
const transform = _transform as unknown as jest.MockInstance<
  ReturnType<typeof _transform>,
  Parameters<typeof _transform>
>;

describe("transformJsonAndCheckStatus", () => {
  it("should resolve a transformed response for 2xx", async () => {
    const transformed = { key: "value" };
    const response = {
      status: 200,
      json: () => Promise.resolve(transformed),
    } as Partial<Response> as Response;
    when(transform).calledWith(response).mockResolvedValue(transformed);
    await expect(transformJsonAndCheckStatus(response)).resolves.toEqual(
      transformed,
    );
  });

  it("should resolve as null for 204 response", async () => {
    const transformed = null;
    const response = {
      status: 204,
    } as Partial<Response> as Response;
    when(transform).calledWith(response).mockResolvedValue(transformed);
    await expect(transformJsonAndCheckStatus(response)).resolves.toEqual(
      transformed,
    );
  });

  it("should reject with a generic Error for a non-2xx response, but transform the response anyway", async () => {
    const transformed = { error: "An Error" };
    const response = {
      status: 308,
      statusText: "Permanent Redirect",
      json: () => Promise.resolve(transformed),
    } as Partial<Response> as Response;
    when(transform).calledWith(response).mockResolvedValue(transformed);
    await transformJsonAndCheckStatus(response).then(
      () => {
        throw new Error("Expected transformJsonAndCheckStatus to be rejected");
      },
      (error) => {
        expect(error instanceof HttpError).toBe(true);
        expect(error instanceof ClientError).toBe(false);
        expect(error instanceof ServerError).toBe(false);
        expect(error.message).toBe(response.statusText);
        expect(error.status).toBe(response.status);
        expect(error.response).toBe(transformed);
      },
    );
  });

  it("should reject with a ClientError for a 4xx response", async () => {
    const transformed = { error: "An Error" };
    const response = {
      status: 404,
      statusText: "Not Found",
      json: () => Promise.resolve(transformed),
    } as Partial<Response> as Response;
    when(transform).calledWith(response).mockResolvedValue(transformed);
    await transformJsonAndCheckStatus(response).then(
      () => {
        throw new Error("Expected transformJsonAndCheckStatus to be rejected");
      },
      (error) => {
        expect(error instanceof ClientError).toBe(true);
        expect(error.message).toBe(response.statusText);
        expect(error.status).toBe(response.status);
        expect(error.response).toBe(transformed);
      },
    );
  });

  it("should reject with a ServerError for a 5xx response", async () => {
    const response = {
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.resolve(undefined),
    } as Partial<Response> as Response;
    when(transform).calledWith(response).mockResolvedValue(undefined);
    await transformJsonAndCheckStatus(response).then(
      () => {
        throw new Error("Expected transformJsonAndCheckStatus to be rejected");
      },
      (error) => {
        expect(error instanceof ServerError).toBe(true);
        expect(error.message).toBe(response.statusText);
        expect(error.status).toBe(response.status);
      },
    );
  });
});
