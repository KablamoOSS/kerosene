import { stubProperties } from "@kablamo/kerosene-test";
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import usePageVisibility from "./usePageVisibility";

describe("usePageVisibility", () => {
  let restoreDocument: () => void;
  let addEventListener: jest.MockedFunction<typeof document.addEventListener>;
  let removeEventListener: jest.MockedFunction<
    typeof document.removeEventListener
  >;
  let hidden: boolean | undefined;
  beforeEach(() => {
    hidden = undefined;
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    restoreDocument = stubProperties(document, {
      addEventListener: { configurable: true, value: addEventListener },
      removeEventListener: { configurable: true, value: removeEventListener },
      hidden: { configurable: true, get: () => hidden! },
    });
  });

  afterEach(() => {
    restoreDocument();
  });

  it("should be useable in output and as a ref when useState===true", () => {
    hidden = false;
    const utils = renderHook(() => usePageVisibility(true));

    expect(utils.result.current).toEqual([true, { current: true }]);

    expect(addEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
      false,
    );
    const onVisibilityChange = addEventListener.mock.calls.find(
      (call) => call[0] === "visibilitychange",
    )![1] as EventListener;

    hidden = true;
    act(() => {
      onVisibilityChange(new Event("visibilitychange"));
    });
    expect(utils.result.current).toEqual([false, { current: false }]);

    utils.unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      onVisibilityChange,
      false,
    );
  });

  it("should be usable as a ref when useState===false", () => {
    hidden = false;
    const utils = renderHook(() => usePageVisibility(false));

    expect(utils.result.current).toEqual({ current: true });

    expect(addEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
      false,
    );
    const onVisibilityChange = addEventListener.mock.calls.find(
      (call) => call[0] === "visibilitychange",
    )![1] as EventListener;

    hidden = true;
    act(() => {
      onVisibilityChange(Symbol("Event") as unknown as Event);
    });
    expect(utils.result.current).toEqual({ current: false });

    utils.unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      onVisibilityChange,
      false,
    );
  });

  it("should fallback to always visible when the page visibility API is not available", () => {
    const root = renderHook(() => usePageVisibility());
    expect(root.result.current[0]).toBe(true);
  });
});
