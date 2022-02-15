import { renderHook } from "@testing-library/react-hooks";
import * as React from "react";
import usePrevious from "./usePrevious";

describe("usePrevious", () => {
  it("should remember the previous value, and default to undefined for the first render", () => {
    const utils = renderHook((value = 1) => usePrevious(value));
    expect(utils.result.current).toBe(undefined);

    utils.rerender(2);
    expect(utils.result.current).toBe(1);
  });

  it("should use the initialValue for initial render, remembering the value from previous render", () => {
    const utils = renderHook((value = 1) => usePrevious(value, 0));
    expect(utils.result.current).toBe(0);

    utils.rerender(2);
    expect(utils.result.current).toBe(1);
  });
});
