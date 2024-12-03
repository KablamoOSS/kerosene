import catchAbortError from "./catchAbortError";

describe("#catchAbortError", () => {
  it.each([
    { name: "Error", error: new Error("an error"), shouldThrow: true },
    {
      name: "DOMException",
      error: new DOMException("an error", "Name"),
      shouldThrow: true,
    },
    {
      name: "AbortError",
      error: new DOMException("aborted", "AbortError"),
      shouldThrow: false,
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
      shouldThrow: false,
    },
    {
      name: "custom object AbortError",
      error: { name: "AbortError" },
      shouldThrow: false,
    },
    { name: "undefined", error: undefined, shouldThrow: true },
  ])("should return $expected for $name", ({ error, shouldThrow }) => {
    if (shouldThrow) {
      expect(() => catchAbortError(error)).toThrow(
        // @ts-expect-error non-error values
        error,
      );
    } else {
      expect(catchAbortError(error)).toBeUndefined();
    }
  });
});
