// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { findLast, identity } from "lodash";
import * as React from "react";
import type { Mock } from "vitest";
import useRect from "./useRect";

vi.mock("./useRafThrottle", () => ({ default: identity }));

vi.mock("../utils/listeners", () => ({
  ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS: { capture: true, passive: true },
  REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS: { capture: true },
}));

const _addEventListener: Mock<Window["addEventListener"]> = vi.fn();
const _removeEventListener: Mock<Window["removeEventListener"]> = vi.fn();
window.addEventListener = _addEventListener;
window.removeEventListener = _removeEventListener;
const _getBoundingClientRect: Mock<Element["getBoundingClientRect"]> = vi
  .fn()
  .mockReturnValue({
    top: 1,
    left: 2,
    bottom: 3,
    right: 4,
    width: 5,
  } as ClientRect);
Element.prototype.getBoundingClientRect = _getBoundingClientRect;

Object.assign(window, {
  pageXOffset: 6,
  pageYOffset: 7,
});

describe("useRect", () => {
  beforeEach(() => {
    _addEventListener.mockClear();
    _removeEventListener.mockClear();
    _getBoundingClientRect.mockClear();
  });

  it("should return a ref, rect and scroll positions for the element", () => {
    const Component = () => {
      const [ref, rect, scroll] = useRect();
      return (
        <div ref={ref as React.Ref<HTMLDivElement>}>
          <div
            data-testid="stub"
            data-rect={JSON.stringify(rect)}
            data-scroll={JSON.stringify(scroll)}
          />
        </div>
      );
    };
    const result = render(<Component />);

    expect(_addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    expect(_addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { capture: true, passive: true },
    );
    const onResize = findLast(
      _addEventListener.mock.calls,
      (args) => args[0] === "resize",
    )![1] as EventListener;
    const onScroll = findLast(
      _addEventListener.mock.calls,
      (args) => args[0] === "scroll",
    )![1] as EventListener;

    expect(JSON.parse(result.getByTestId("stub").dataset.rect!)).toEqual({
      top: 1,
      left: 2,
      bottom: 3,
      right: 4,
    });
    expect(JSON.parse(result.getByTestId("stub").dataset.scroll!)).toEqual({
      scrollX: 6,
      scrollY: 7,
    });

    result.unmount();

    expect(_removeEventListener).toHaveBeenCalledWith("resize", onResize);
    expect(_removeEventListener).toHaveBeenCalledWith("scroll", onScroll, {
      capture: true,
    });
  });

  it("should add and remove listeners for events specified", () => {
    const Component = ({
      eventList,
    }: {
      eventList: ReadonlyArray<keyof WindowEventMap>;
    }) => {
      const [ref] = useRect(false, eventList);
      return (
        <div ref={ref as React.Ref<HTMLDivElement>}>
          <div />
        </div>
      );
    };
    let props: React.ComponentPropsWithoutRef<typeof Component> = {
      eventList: ["transitionend"],
    };
    const result = render(<Component {...props} />);

    expect(_addEventListener).toHaveBeenCalledWith(
      "transitionend",
      expect.any(Function),
      { capture: true, passive: true },
    );
    expect(_addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { capture: true, passive: true },
    );

    const getOnTransitionEnd = () =>
      findLast(
        _addEventListener.mock.calls,
        (args) => args[0] === "transitionend",
      )![1] as EventListener;
    const getOnScroll = () =>
      findLast(
        _addEventListener.mock.calls,
        (args) => args[0] === "scroll",
      )![1] as EventListener;

    const onTransitionEnd1 = getOnTransitionEnd();
    const onScroll1 = getOnScroll();

    _addEventListener.mockReset();
    props = { eventList: ["transitionend", "click"] };
    result.rerender(<Component {...props} />);

    expect(_removeEventListener).toHaveBeenCalledWith(
      "transitionend",
      onTransitionEnd1,
      {
        capture: true,
      },
    );
    expect(_removeEventListener).toHaveBeenCalledWith("scroll", onScroll1, {
      capture: true,
    });

    expect(_addEventListener).toHaveBeenCalledWith(
      "transitionend",
      expect.any(Function),
      { capture: true, passive: true },
    );
    expect(_addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      { capture: true, passive: true },
    );
    expect(_addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { capture: true, passive: true },
    );

    const onTransitionEnd2 = getOnTransitionEnd();
    const onClick = findLast(
      _addEventListener.mock.calls,
      (args) => args[0] === "click",
    )![1] as EventListener;
    const onScroll2 = getOnScroll();

    _removeEventListener.mockReset();
    result.unmount();

    expect(_removeEventListener).toHaveBeenCalledWith(
      "transitionend",
      onTransitionEnd2,
      {
        capture: true,
      },
    );
    expect(_removeEventListener).toHaveBeenCalledWith("click", onClick, {
      capture: true,
    });
    expect(_removeEventListener).toHaveBeenCalledWith("scroll", onScroll2, {
      capture: true,
    });
  });
});
