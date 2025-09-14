import _contentType, { type ParsedMediaType } from "content-type";
import { when } from "jest-when";
import type { DeepPartial } from "../types";
import transform, { createTransform, transformDefaultJson } from "./transform";

jest.mock("content-type");
const contentType = _contentType as unknown as jest.Mocked<typeof _contentType>;

const contentTypes = [
  {
    type: "application/json",
    method: "json",
    content: { some: "prop" },
    hasExplicitSupport: true,
  },
  {
    type: "text/plain",
    method: "text",
    content: "Text",
    hasExplicitSupport: true,
  },
  {
    type: "application/pdf",
    method: "blob",
    content: Symbol("Blob"),
    hasExplicitSupport: false,
  },
  {
    type: "application/zip",
    method: "blob",
    content: Symbol("Blob"),
    hasExplicitSupport: false,
  },
  {
    type: "application/octet-stream",
    method: "blob",
    content: Symbol("Blob"),
    hasExplicitSupport: false,
  },
] as const satisfies {
  type: string;
  method: string;
  content: unknown;
  hasExplicitSupport: boolean;
}[];

describe("transform", () => {
  it("should resolve a 204 status as null", async () => {
    await expect(
      transform({ status: 204 } as Partial<Response> as Response),
    ).resolves.toBe(null);
  });

  it("should resolve a response without a content type as text", async () => {
    const text = "Text";
    await expect(
      transform({
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        async text() {
          return text;
        },
      } as DeepPartial<Response> as Response),
    ).resolves.toBe(text);
  });

  contentTypes.forEach(({ type, method, content }) => {
    it(`should use ${method}() for ${type}`, async () => {
      const header = `${type}; charset=utf-8`;
      when(contentType.parse)
        .calledWith(header)
        .mockReturnValue({
          type,
        } as Partial<ParsedMediaType> as ParsedMediaType);
      const getHeaders = jest.fn();
      when(getHeaders).calledWith("Content-Type").mockReturnValue(header);
      await expect(
        transform({
          status: 200,
          headers: {
            get: getHeaders,
          },
          [method]: async () => content,
        } as DeepPartial<Response> as Response),
      ).resolves.toEqual(content);
    });
  });
});

describe("createTransform", () => {
  it("should resolve a 204 status as null", async () => {
    const customTransform = createTransform();
    await expect(
      customTransform({ status: 204 } as Partial<Response> as Response),
    ).resolves.toBe(null);
  });

  it("should resolve a response without a content type as the defaultTransform result", async () => {
    const result = "transformedValue";
    const customTransform = createTransform({
      defaultTransform: () => Promise.resolve(result),
    });
    await expect(
      customTransform({
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as DeepPartial<Response> as Response),
    ).resolves.toBe(result);
  });

  contentTypes.forEach(({ type, method, content, hasExplicitSupport }) => {
    const result = "transformedValue";
    const customTransform = createTransform({
      defaultTransform: () => Promise.resolve(result),
    });

    it(
      hasExplicitSupport
        ? `should use ${method}() for ${type}`
        : `should use the provided transform for type ${type}`,
      async () => {
        const header = `${type}; charset=utf-8`;
        when(contentType.parse)
          .calledWith(header)
          .mockReturnValue({
            type,
          } as Partial<ParsedMediaType> as ParsedMediaType);
        const getHeaders = jest.fn();
        when(getHeaders).calledWith("Content-Type").mockReturnValue(header);
        await expect(
          customTransform({
            status: 200,
            headers: {
              get: getHeaders,
            },
            [method]: async () => content,
          } as DeepPartial<Response> as Response),
        ).resolves.toEqual(hasExplicitSupport ? content : result);
      },
    );
  });
});

describe("transformDefaultJson", () => {
  it("should resolve a 204 status as null", async () => {
    await expect(
      transformDefaultJson({
        status: 204,
      } as Partial<Response> as Response),
    ).resolves.toBe(null);
  });

  it("should resolve a response without a content type as the json result", async () => {
    const result = "transformedValue";
    await expect(
      transformDefaultJson({
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        json: () => Promise.resolve(result),
      } as DeepPartial<Response> as Response),
    ).resolves.toBe(result);
  });

  contentTypes.forEach(({ type, method, content, hasExplicitSupport }) => {
    const result = { key: "value" };
    it(
      hasExplicitSupport
        ? `should use ${method}() for ${type}`
        : `should use the json transform for type ${type}`,
      async () => {
        const header = `${type}; charset=utf-8`;
        when(contentType.parse)
          .calledWith(header)
          .mockReturnValue({
            type,
          } as Partial<ParsedMediaType> as ParsedMediaType);
        const getHeaders = jest.fn();
        when(getHeaders).calledWith("Content-Type").mockReturnValue(header);
        await expect(
          transformDefaultJson({
            status: 200,
            headers: {
              get: getHeaders,
            },
            json: () => Promise.resolve(result),
            [method]: async () => content,
          } as DeepPartial<Response> as Response),
        ).resolves.toEqual(hasExplicitSupport ? content : result);
      },
    );
  });
});
