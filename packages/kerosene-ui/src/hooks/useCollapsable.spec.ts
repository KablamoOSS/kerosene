import type { Mutable } from "@kablamo/kerosene";
import { act, renderHook, RenderHookResult } from "@testing-library/react";
import { when } from "jest-when";
import useCollapsable, { UseCollapsableReturn } from "./useCollapsable";

const mockUseMediaQuery: jest.MockedFunction<
  typeof import("./useMediaQuery")["default"]
> = jest.fn();
jest.mock("./useMediaQuery", () => ({
  __esModule: true,
  get default() {
    return mockUseMediaQuery;
  },
}));

type HookTestProps = Parameters<typeof useCollapsable>[1] & {
  open: boolean;
};

describe("useCollapsable", () => {
  let repaint: () => Promise<void>;
  let tick: (ms: number) => Promise<void>;
  let setup: (
    initialProps: HookTestProps,
  ) => RenderHookResult<UseCollapsableReturn, HookTestProps>;
  let el: HTMLElement;
  beforeEach(() => {
    jest.useFakeTimers();
    // clock = FakeTimers.install();
    repaint = () =>
      act(async () => {
        jest.advanceTimersByTime(34);
      });
    tick = (ms) =>
      act(async () => {
        jest.advanceTimersByTime(ms);
      });
    el = {
      scrollHeight: 500,
    } as Partial<HTMLElement> as HTMLElement;
    setup = (initialProps: HookTestProps) =>
      renderHook(
        ({ open, ...options }) => {
          const result = useCollapsable(open, options);
          (result.ref as Mutable<typeof result.ref>).current = el;
          return result;
        },
        { initialProps },
      );
  });

  afterEach(() => {
    // clock.uninstall();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it.each([
    { immediate: true, prefersReducedMotion: false },
    { immediate: false, prefersReducedMotion: true },
  ])(
    "should perform actions immediately when immediate=$immediate,prefersReducedMotion=$prefersReducedMotion",
    ({ immediate, prefersReducedMotion }) => {
      when(mockUseMediaQuery)
        .calledWith("(prefers-reduced-motion: reduce)")
        .mockReturnValue(prefersReducedMotion);

      const { result, rerender } = setup({ open: false, immediate });
      expect(result.current.render).toBe(false);
      expect(result.current.style).toEqual({
        maxHeight: 0,
        overflow: "hidden",
        transitionProperty: "max-height",
        transitionDuration: "0ms",
        transitionTimingFunction: "ease-in-out",
      });

      rerender({ open: true, immediate });
      expect(result.current.render).toBe(true);
      expect(result.current.style).toEqual({
        maxHeight: "none",
        overflow: "hidden",
        transitionProperty: "max-height",
        transitionDuration: "0ms",
        transitionTimingFunction: "ease-in-out",
      });

      rerender({ open: false, immediate });
      expect(result.current.render).toBe(false);
      expect(result.current.style).toEqual({
        maxHeight: 0,
        overflow: "hidden",
        transitionProperty: "max-height",
        transitionDuration: "0ms",
        transitionTimingFunction: "ease-in-out",
      });
    },
  );

  it("should orchestrate transitions appropriately", async () => {
    when(mockUseMediaQuery)
      .calledWith("(prefers-reduced-motion: reduce)")
      .mockReturnValue(false);
    const { result, rerender } = setup({ open: false });
    expect(result.current.render).toBe(false);
    expect(result.current.style).toEqual({
      maxHeight: 0,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "250ms",
      transitionTimingFunction: "ease-in-out",
    });

    rerender({ open: true });
    // transition-duration: 0ms
    expect(result.current.style).toEqual({
      maxHeight: 0,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "0ms",
      transitionTimingFunction: "ease-in-out",
    });

    await repaint();
    // transition-duration: 250ms, max-height: 0, render: true
    expect(result.current.render).toBe(true);
    expect(result.current.style).toEqual({
      maxHeight: 0,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "250ms",
      transitionTimingFunction: "ease-in-out",
    });

    await repaint();
    // max-height: 500
    expect(result.current.render).toBe(true);
    expect(result.current.style).toEqual({
      maxHeight: 500,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "250ms",
      transitionTimingFunction: "ease-in-out",
    });

    await tick(250);
    // max-height: none
    expect(result.current.render).toBe(true);
    expect(result.current.style).toEqual({
      maxHeight: "none",
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "250ms",
      transitionTimingFunction: "ease-in-out",
    });

    rerender({ open: false });
    // max-height: 500, transition-duration: 250ms
    expect(result.current.render).toBe(true);
    expect(result.current.style).toEqual({
      maxHeight: 500,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "250ms",
      transitionTimingFunction: "ease-in-out",
    });

    await repaint();
    // max-height: 0
    expect(result.current.render).toBe(true);
    expect(result.current.style).toEqual({
      maxHeight: 0,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "250ms",
      transitionTimingFunction: "ease-in-out",
    });

    await tick(250);
    // render: false
    expect(result.current.render).toBe(false);
    expect(result.current.style).toEqual({
      maxHeight: 0,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: "250ms",
      transitionTimingFunction: "ease-in-out",
    });
  });
});
