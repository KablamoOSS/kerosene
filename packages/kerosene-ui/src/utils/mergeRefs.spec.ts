import * as React from "react";
import type { Mock } from "vitest";
import mergeRefs from "./mergeRefs";

describe("#mergeRefs", () => {
  const instance = Symbol("ref");

  it("should combine multiple types of refs, ignoring null and undefined", () => {
    const refObject = React.createRef<typeof instance>();
    let callbackInstance: typeof instance | null = null;
    const callbackRef = (ref: typeof callbackInstance) => {
      callbackInstance = ref;
    };

    const merged = mergeRefs(refObject, callbackRef, null, undefined);

    const cleanup = merged(instance);
    expect(refObject.current).toBe(instance);
    expect(callbackInstance).toBe(instance);

    expect(cleanup).toBeUndefined();

    merged(null);
    expect(refObject.current).toBe(null);
    expect(callbackInstance).toBe(null);
  });

  it("should throw if a callback ref returns a cleanup function", () => {
    const cleanup: Mock<() => void> = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ref = vi.fn((_instance: typeof instance | null) => cleanup);

    const merged = mergeRefs(ref);

    expect(() => merged(instance)).toThrow();
  });
});
