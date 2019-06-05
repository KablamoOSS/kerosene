import { when } from "jest-when";
import transformAndCheckStatus from "./transformAndCheckStatus";
import _transform from "./transform";

jest.mock("./transform");
const transform = (_transform as unknown) as jest.MockInstance<
  ReturnType<typeof _transform>,
  Parameters<typeof _transform>
>;

describe("transformAndCheckStatus", () => {
  it("should resolve a transformed response for 2xx", async () => {
    const transformed = { key: "value" };
    const response = ({
      status: 200,
    } as Partial<Response>) as Response;
    when(transform)
      .calledWith(response)
      .mockResolvedValue(transformed);
    await expect(transformAndCheckStatus(response)).resolves.toEqual(
      transformed,
    );
  });

  it("should reject for a non-2xx response, but transform the response anyway", async () => {
    const transformed = { error: "An Error" };
    const response = ({
      status: 400,
      statusText: "Bad Request",
    } as Partial<Response>) as Response;
    when(transform)
      .calledWith(response)
      .mockResolvedValue(transformed);
    await transformAndCheckStatus(response).then(
      () => {
        throw new Error("Expected transformAndCheckStatus to be rejected");
      },
      error => {
        expect(error.message).toBe(response.statusText);
        expect(error.status).toBe(response.status);
        expect(error.response).toBe(transformed);
      },
    );
  });
});
