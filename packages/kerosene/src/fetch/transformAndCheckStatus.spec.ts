import type { Mock } from "vitest";
import { when } from "vitest-when";
import ClientError from "./clientError";
import HttpError from "./httpError";
import ServerError from "./serverError";
import {
  createTransform as _createTransform,
  type CreateTransformOptions,
} from "./transform";
import transformAndCheckStatus, {
  createTransformAndCheckStatus,
  transformAndCheckStatusDefaultJson,
} from "./transformAndCheckStatus";

vi.mock("./transform");
const createTransform = _createTransform as unknown as Mock<
  typeof _createTransform
>;

beforeEach(() => {
  createTransform.mockReset();
});

describe("transformAndCheckStatus", () => {
  it("should resolve a transformed response for 2xx", async () => {
    const transformed = { key: "value" };
    const response = {
      status: 200,
    } as Partial<Response> as Response;
    when(createTransform)
      .calledWith({})
      .thenReturn(() => Promise.resolve(transformed));
    await expect(transformAndCheckStatus(response)).resolves.toEqual(
      transformed,
    );
  });

  it("should resolve as null for 204 response", async () => {
    const transformed = null;
    const response = {
      status: 204,
    } as Partial<Response> as Response;
    when(createTransform)
      .calledWith({})
      .thenReturn(() => Promise.resolve(transformed));
    await expect(transformAndCheckStatus(response)).resolves.toEqual(
      transformed,
    );
  });

  it("should reject with a generic Error for a non-2xx response, but transform the response anyway", async () => {
    const transformed = { error: "An Error" };
    const response = {
      status: 308,
      statusText: "Permanent Redirect",
    } as Partial<Response> as Response;
    when(createTransform)
      .calledWith({})
      .thenReturn(() => Promise.resolve(transformed));
    await transformAndCheckStatus(response).then(
      () => {
        throw new Error("Expected transformAndCheckStatus to be rejected");
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
    } as Partial<Response> as Response;
    when(createTransform)
      .calledWith({})
      .thenReturn(() => Promise.resolve(transformed));
    await transformAndCheckStatus(response).then(
      () => {
        throw new Error("Expected transformAndCheckStatus to be rejected");
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
    } as Partial<Response> as Response;
    when(createTransform)
      .calledWith({})
      .thenReturn(() => Promise.resolve(undefined));
    await transformAndCheckStatus(response).then(
      () => {
        throw new Error("Expected transformAndCheckStatus to be rejected");
      },
      (error) => {
        expect(error instanceof ServerError).toBe(true);
        expect(error.message).toBe(response.statusText);
        expect(error.status).toBe(response.status);
      },
    );
  });
});

describe("createTransformAndCheckStatus", () => {
  it("should resolve a custom transformed response for 2xx if a transform is provided", async () => {
    const transformed = { key: "transformedValue" };
    const defaultTransform = () => Promise.resolve(transformed);
    const options: CreateTransformOptions = { defaultTransform };
    const response = {
      status: 200,
    } as Partial<Response> as Response;
    when(createTransform).calledWith(options).thenReturn(defaultTransform);
    await expect(
      createTransformAndCheckStatus(options)(response),
    ).resolves.toEqual(transformed);
  });
});

describe("transformAndCheckStatusDefaultJson", () => {
  it("should resolve a json response for 2xx", async () => {
    const transformed = { key: "transformedValue" };
    const response = {
      status: 200,
    } as Partial<Response> as Response;
    createTransform.mockReturnValueOnce(() => Promise.resolve(transformed));
    await expect(transformAndCheckStatusDefaultJson(response)).resolves.toEqual(
      transformed,
    );
  });
});
