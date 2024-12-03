import isAbortError from "./isAbortError";

describe("#isAbortError", () => {
  it.each([
    { name: "Error", error: new Error("an error"), expected: false },
    {
      name: "DOMException",
      error: new DOMException("an error", "Name"),
      expected: false,
    },
    {
      name: "AbortError",
      error: new DOMException("aborted", "AbortError"),
      expected: true,
    },
    {
      name: "AbortError thrown by signal",
      error: (() => {
        const controller = new AbortController();
        controller.abort();

        try {
          controller.signal.throwIfAborted();
        } catch (err) {
          return err as DOMException;
        }

        throw new Error("expected an error");
      })(),
      expected: true,
    },
    {
      name: "custom object AbortError",
      error: { name: "AbortError" },
      expected: true,
    },
    { name: "undefined", error: undefined, expected: false },
  ])("should return $expected for $name", ({ error, expected }) => {
    expect(isAbortError(error)).toBe(expected);
  });
});
