import { findLast, identity } from "lodash";
import { mount } from "enzyme";
import createSandbox from "jest-sandbox";
import * as React from "react";
import useRect from "./useRect";

jest.mock("./useRafThrottle", () => identity);

jest.mock("../utils/listeners", () => ({
  ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS: { capture: true, passive: true },
  REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS: { capture: true },
}));

const StubComponent = ({ ...props }) => <div {...props} />;

const sandbox = createSandbox();
const _addEventListener: jest.Mock<
  void,
  Parameters<Window["addEventListener"]>
> = sandbox.fn();
const _removeEventListener: jest.Mock<
  void,
  Parameters<Window["removeEventListener"]>
> = sandbox.fn();
window.addEventListener = _addEventListener;
window.removeEventListener = _removeEventListener;
Element.prototype.getBoundingClientRect = sandbox.fn().mockReturnValue({
  top: 1,
  left: 2,
  bottom: 3,
  right: 4,
  width: 5,
} as ClientRect);

Object.assign(window, {
  pageXOffset: 6,
  pageYOffset: 7,
});

describe("useRect", () => {
  beforeEach(() => {
    sandbox.clear();
  });

  it("should return a ref, rect and scroll positions for the element", () => {
    const Component = () => {
      const [ref, rect, scroll] = useRect();
      return (
        <div ref={ref as React.Ref<HTMLDivElement>}>
          <StubComponent rect={rect} scroll={scroll} />
        </div>
      );
    };
    const root = mount(<Component />);
    // hack to force useEffect() to trigger
    root.setProps({});

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
      args => args[0] === "resize",
    )![1] as EventListener;
    const onScroll = findLast(
      _addEventListener.mock.calls,
      args => args[0] === "scroll",
    )![1] as EventListener;

    expect(root.find(StubComponent)).toHaveProp("rect", {
      top: 1,
      left: 2,
      bottom: 3,
      right: 4,
    });
    expect(root.find(StubComponent)).toHaveProp("scroll", {
      scrollX: 6,
      scrollY: 7,
    });

    root.unmount();

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
          <StubComponent />
        </div>
      );
    };
    let props: React.ComponentPropsWithoutRef<typeof Component> = {
      eventList: ["transitionend"],
    };
    const root = mount(<Component {...props} />);
    // hack to force useEffect() to trigger
    root.setProps(props);

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
        args => args[0] === "transitionend",
      )![1] as EventListener;
    const getOnScroll = () =>
      findLast(
        _addEventListener.mock.calls,
        args => args[0] === "scroll",
      )![1] as EventListener;

    const onTransitionEnd1 = getOnTransitionEnd();
    const onScroll1 = getOnScroll();

    _addEventListener.mockReset();
    props = { eventList: ["transitionend", "click"] };
    root.setProps(props);
    // hack to trigger useEffect()
    root.setProps(props);

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
      args => args[0] === "click",
    )![1] as EventListener;
    const onScroll2 = getOnScroll();

    _removeEventListener.mockReset();
    root.unmount();

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
