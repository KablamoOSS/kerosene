// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import useUpdatingRef from "./useUpdatingRef";

describe("useUpdatingRef", () => {
  it("should return a ref to the value which updates", () => {
    const {
      rerender,
      result: { current: ref },
    } = renderHook(useUpdatingRef, {
      initialProps: 1,
    });
    expect(ref.current).toBe(1);

    rerender(2);
    expect(ref.current).toBe(2);
  });
});
