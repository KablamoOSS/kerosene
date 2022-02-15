import { renderHook } from "@testing-library/react-hooks";
import useAbortController from "./useAbortController";

describe("#useAbortController", () => {
  it("should manage a series of AbortControllers", () => {
    const utils = renderHook(() => useAbortController());
    expect(utils.result.current.ref.current).toBe(undefined);

    const first = utils.result.current.next();
    expect(first).toBeInstanceOf(AbortController);
    expect(first.signal.aborted).toBe(false);
    expect(utils.result.current.ref.current).toBe(first);

    const second = utils.result.current.next();
    expect(second).toBeInstanceOf(AbortController);
    expect(second.signal.aborted).toBe(false);
    expect(utils.result.current.ref.current).toBe(second);

    expect(first.signal.aborted).toBe(true);

    utils.unmount();
    expect(second.signal.aborted).toBe(true);
  });
});
