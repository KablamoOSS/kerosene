// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { identity } from "lodash";
import type { Mock } from "vitest";
import { when } from "vitest-when";
import {
  ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
  REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
} from "../utils/listeners";
import useFocusVisible from "./useFocusVisible";

const FOCUS_EVENTS = ["focus", "blur"] as const;
describe("useFocusVisible", () => {
  let addEventListener: Mock<typeof window.addEventListener>;
  let removeEventListener: Mock<typeof window.removeEventListener>;
  let querySelector: Mock<typeof document.querySelector>;
  let supports: Mock<typeof CSS.supports>;
  const update = () =>
    act(() => {
      addEventListener.mock.calls
        .filter(([name]) => (FOCUS_EVENTS as readonly string[]).includes(name))
        .forEach(([, listener]) => {
          (listener as () => void)();
        });
    });
  const getUpdate = () =>
    addEventListener.mock.calls.find(
      ([name]) => name === "focus",
    )![1] as () => void;
  beforeEach(() => {
    addEventListener = vi.spyOn(window, "addEventListener");
    removeEventListener = vi.spyOn(window, "removeEventListener");
    querySelector = vi.spyOn(document, "querySelector");
    supports = vi.spyOn(CSS, "supports");
  });

  it("should return whether :focus-visible is present", () => {
    when(supports).calledWith("selector(:focus-visible)").thenReturn(true);
    when(querySelector)
      .calledWith(":focus-visible")
      .thenReturn({} as Element);

    const { result, unmount } = renderHook(() => useFocusVisible());

    FOCUS_EVENTS.forEach((name) => {
      expect(addEventListener).toHaveBeenCalledWith(
        name,
        getUpdate(),
        ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
      );
    });

    expect(result.current).toBe(true);

    when(querySelector).calledWith(":focus-visible").thenReturn(null);
    update();

    expect(result.current).toBe(false);

    unmount();
    FOCUS_EVENTS.forEach((name) => {
      expect(removeEventListener).toHaveBeenCalledWith(
        name,
        getUpdate(),
        REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
      );
    });
  });

  it("should return whether :focus is present in a browser which doesn't support :focus-visible", () => {
    when(supports).calledWith("selector(:focus-visible)").thenReturn(false);
    when(querySelector)
      .calledWith(":focus")
      .thenReturn({} as Element);

    const { result, unmount } = renderHook(() => useFocusVisible());

    FOCUS_EVENTS.forEach((name) => {
      expect(addEventListener).toHaveBeenCalledWith(
        name,
        getUpdate(),
        ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
      );
    });

    expect(result.current).toBe(true);

    when(querySelector).calledWith(":focus").thenReturn(null);
    update();

    expect(result.current).toBe(false);

    unmount();
    FOCUS_EVENTS.forEach((name) => {
      expect(removeEventListener).toHaveBeenCalledWith(
        name,
        getUpdate(),
        REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
      );
    });
  });

  it("should return false during hydration", () => {
    when(supports).calledWith("selector(:focus-visible)").thenReturn(true);
    when(querySelector)
      .calledWith(":focus-visible")
      .thenReturn({} as Element);

    const onRender: Mock<(value: boolean) => boolean> = vi
      .fn()
      .mockImplementation(identity);
    const { result } = renderHook(() => onRender(useFocusVisible()), {
      hydrate: true,
    });
    expect(onRender).toHaveBeenNthCalledWith(1, false);
    expect(result.current).toBe(true);
  });
});
