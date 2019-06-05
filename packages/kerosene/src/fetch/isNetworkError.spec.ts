import isNetworkError from "./isNetworkError";

describe("isNetworkError", () => {
  [
    { error: new TypeError("Failed to fetch"), userAgent: "Chrome or Opera" },
    { error: new TypeError("NetworkError"), userAgent: "Firefox or MS Edge" },
    { error: new TypeError("Network error"), userAgent: "Safari" },
    {
      error: new TypeError("Network request failed"),
      userAgent: "Whatwg fetch polyfill",
    },
  ].forEach(({ error, userAgent }) => {
    it(`should detect a network failure for ${userAgent} correctly`, () => {
      expect(isNetworkError(error)).toBe(true);
    });
  });

  [
    { description: "a regular error", error: new Error("Not Found") },
    {
      description: "a TypeError with a message that does not match",
      error: new TypeError("Incorrect parameters"),
    },
    { description: "a string", error: "rejected" },
  ].forEach(({ description, error }) => {
    it(`should return false for ${description}`, () => {
      expect(isNetworkError(error)).toBe(false);
    });
  });
});
