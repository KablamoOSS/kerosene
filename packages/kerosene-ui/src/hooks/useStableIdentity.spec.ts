// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import useStableIdentity from "./useStableIdentity";

describe("useStableIdentity", () => {
  it("should return the same reference whilst the values are considered equal", () => {
    const initialValue: readonly unknown[] = [];
    const { rerender, result } = renderHook(
      (value) => useStableIdentity(value),
      { initialProps: initialValue },
    );
    expect(result.current).toBe(initialValue);

    rerender([]);
    expect(result.current).toBe(initialValue);

    const nextValue = [1, 2, 3];
    rerender(nextValue);
    expect(result.current).toBe(nextValue);

    rerender(nextValue.slice());
    expect(result.current).toBe(nextValue);
  });
});
