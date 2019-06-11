import * as React from "react";
import mergeRefs from "./mergeRefs";

describe("#mergeRefs", () => {
  it("should combine multiple types of refs, ignoring null and undefined", () => {
    const instance = Symbol("ref");

    const refObject = React.createRef<typeof instance>();
    let callbackInstance: typeof instance | null = null;
    const callbackRef = (ref: typeof callbackInstance) =>
      (callbackInstance = ref);

    const merged = mergeRefs(refObject, callbackRef, null, undefined);

    merged(instance);
    expect(refObject.current).toBe(instance);
    expect(callbackInstance).toBe(instance);

    merged(null);
    expect(refObject.current).toBe(null);
    expect(callbackInstance).toBe(null);
  });
});
