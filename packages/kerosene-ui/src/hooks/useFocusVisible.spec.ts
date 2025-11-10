import { act, renderHook } from "@testing-library/react";
import { when } from "jest-when";
import identity from "lodash/identity";
import {
  ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
  REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
} from "../utils/listeners";
import useFocusVisible from "./useFocusVisible";

const FOCUS_EVENTS = ["focus", "blur"] as const;
describe("useFocusVisible", () => {
  let addEventListener: jest.SpiedFunction<typeof window.addEventListener>;
  let removeEventListener: jest.SpiedFunction<
    typeof window.removeEventListener
  >;
  let querySelector: jest.SpiedFunction<typeof document.querySelector>;
  let supports: jest.SpiedFunction<typeof CSS.supports>;
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
    addEventListener = jest.spyOn(window, "addEventListener");
    removeEventListener = jest.spyOn(window, "removeEventListener");
    querySelector = jest.spyOn(document, "querySelector");
    supports = jest.spyOn(CSS, "supports");
  });

  it("should return whether :focus-visible is present", () => {
    when(supports).calledWith("selector(:focus-visible)").mockReturnValue(true);
    when(querySelector)
      .calledWith(":focus-visible")
      .mockReturnValue({} as Element);

    const { result, unmount } = renderHook(() => useFocusVisible());

    FOCUS_EVENTS.forEach((name) => {
      expect(addEventListener).toHaveBeenCalledWith(
        name,
        getUpdate(),
        ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
      );
    });

    expect(result.current).toBe(true);

    when(querySelector).calledWith(":focus-visible").mockReturnValue(null);
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
    when(supports)
      .calledWith("selector(:focus-visible)")
      .mockReturnValue(false);
    when(querySelector)
      .calledWith(":focus")
      .mockReturnValue({} as Element);

    const { result, unmount } = renderHook(() => useFocusVisible());

    FOCUS_EVENTS.forEach((name) => {
      expect(addEventListener).toHaveBeenCalledWith(
        name,
        getUpdate(),
        ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
      );
    });

    expect(result.current).toBe(true);

    when(querySelector).calledWith(":focus").mockReturnValue(null);
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
    when(supports).calledWith("selector(:focus-visible)").mockReturnValue(true);
    when(querySelector)
      .calledWith(":focus-visible")
      .mockReturnValue({} as Element);

    const onRender: jest.Mock<boolean, [boolean]> = jest
      .fn()
      .mockImplementation(identity);
    const { result } = renderHook(() => onRender(useFocusVisible()), {
      hydrate: true,
    });
    expect(onRender).toHaveBeenNthCalledWith(1, false);
    expect(result.current).toBe(true);
  });
});
