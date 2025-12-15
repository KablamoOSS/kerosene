// @vitest-environment jsdom

import { stubProperties } from "@kablamo/kerosene-test";
import { renderHook } from "@testing-library/react";
import { identity } from "lodash";
import { act } from "react";
import type { Mock } from "vitest";
import usePageVisibility from "./usePageVisibility";

describe("usePageVisibility", () => {
  let restoreDocument: () => void;
  let addEventListener: Mock<typeof document.addEventListener>;
  let removeEventListener: Mock<typeof document.removeEventListener>;
  let hidden: boolean | undefined;
  beforeEach(() => {
    hidden = undefined;
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
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
    );
  });

  it("should be usable as a ref when useState===false", () => {
    hidden = false;
    const utils = renderHook(() => usePageVisibility(false));

    expect(utils.result.current).toEqual({ current: true });

    expect(addEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
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
    );
  });

  it("should fallback to always visible when the page visibility API is not available", () => {
    const root = renderHook(() => usePageVisibility());
    expect(root.result.current[0]).toBe(true);
  });

  it("should return true on hydration", () => {
    hidden = true;
    const onRender: Mock<(value: boolean) => boolean> = vi
      .fn()
      .mockImplementation(identity);
    renderHook(
      () => {
        const [visible] = usePageVisibility();
        return onRender(visible);
      },
      { hydrate: true },
    );

    expect(onRender).toHaveBeenNthCalledWith(1, true);
    expect(onRender).toHaveBeenLastCalledWith(false);
  });
});
