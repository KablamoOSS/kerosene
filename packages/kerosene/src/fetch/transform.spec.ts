import _contentType, { ParsedMediaType } from "content-type";
import { when } from "jest-when";
import { DeepPartial } from "../types";
import transform from "./transform";

jest.mock("content-type");
const contentType = (_contentType as unknown) as jest.Mocked<
  typeof _contentType
>;

describe("transform", () => {
  it("should resolve a 204 status as null", async () => {
    await expect(
      transform(({ status: 204 } as Partial<Response>) as Response),
    ).resolves.toBe(null);
  });

  it("should resolve a response without a content type as text", async () => {
    const text = "Text";
    await expect(
      transform(({
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        async text() {
          return text;
        },
      } as DeepPartial<Response>) as Response),
    ).resolves.toBe(text);
  });

  [
    {
      type: "application/json",
      method: "json",
      content: { some: "prop" },
    },
    {
      type: "text/plain",
      method: "text",
      content: "Text",
    },
    {
      type: "application/pdf",
      method: "blob",
      content: Symbol("Blob"),
    },
    {
      type: "application/zip",
      method: "blob",
      content: Symbol("Blob"),
    },
    {
      type: "application/octet-stream",
      method: "blob",
      content: Symbol("Blob"),
    },
  ].forEach(({ type, method, content }) => {
    it(`should use ${method}() for ${type}`, async () => {
      const header = `${type}; charset=utf-8`;
      when(contentType.parse)
        .calledWith(header)
        .mockReturnValue(({
          type,
        } as Partial<ParsedMediaType>) as ParsedMediaType);
      const getHeaders = jest.fn();
      when(getHeaders)
        .calledWith("Content-Type")
        .mockReturnValue(header);
      await expect(
        transform({
          status: 200,
          headers: {
            get: getHeaders,
          },
          [method]: async () => content,
        } as any),
      ).resolves.toEqual(content);
    });
  });
});
