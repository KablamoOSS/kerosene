import { identity, last } from "lodash";
import { mount } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import usePopup from "./usePopup";

jest.mock("./useRafThrottle", () => identity);

const StubComponent = ({ ...props }) => <div {...props} />;

const _addEventListener = jest.spyOn(window, "addEventListener");
Element.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
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

describe("#usePopup", () => {
  it("should create an element for a portal and return the props", () => {
    const Component = ({ zIndex }: { zIndex?: string | null }) => {
      const { open, setOpen, ref, rect, portalEl, scrollX, scrollY } = usePopup(
        zIndex,
      );

      return (
        <React.Fragment>
          <div ref={ref as React.Ref<HTMLDivElement>}>
            <StubComponent onClick={() => setOpen(previous => !previous)} />
          </div>
          {portalEl.current &&
            ReactDOM.createPortal(
              <p
                data-open={open}
                style={{
                  top: scrollY + rect.bottom,
                  left: scrollX + rect.left,
                  width: rect.right - rect.left,
                }}
              >
                Test
              </p>,
              portalEl.current,
            )}
        </React.Fragment>
      );
    };

    const root = mount(<Component />);
    // hack to trigger useEffect()
    root.setProps({});

    const onClickOutside = (e: Event) =>
      act(() => {
        (last(
          _addEventListener.mock.calls.filter(args => args[0] === "click"),
        )![1] as EventListener)(e);
      });

    const popup = () => root.find("p");

    const open = () => popup().prop("data-open") as boolean;

    expect(open()).toBe(false);
    expect(popup()).toHaveText("Test");

    const portalEl = () => document.body.lastChild as HTMLDivElement;
    (Object.entries({
      position: "absolute",
      top: "0px",
      left: "0px",
      bottom: "0px",
      right: "0px",
      overflow: "visible",
      pointerEvents: "none",
      zIndex: "",
    }) as [keyof CSSStyleDeclaration, string | null][]).forEach(
      ([key, value]) => expect(portalEl().style[key]).toBe(value),
    );

    root.find(StubComponent).simulate("click");
    // hack to trigger useEffect()
    root.setProps({});

    expect(open()).toBe(true);
    expect(popup()).toHaveProp("style", {
      top: 3 + 7,
      left: 6 + 2,
      width: 4 - 2,
    });

    [
      root
        .find("div")
        .at(0)
        .getDOMNode(),
      portalEl(),
    ].forEach(target => {
      onClickOutside(({
        target,
      } as Partial<Event>) as Event);
      // hack to trigger useEffect()
      root.setProps({});

      expect(open()).toBe(true);
    });

    onClickOutside(({
      target: document.body,
    } as Partial<Event>) as Event);
    // hack to trigger useEffect()
    root.setProps({});
    expect(open()).toBe(false);

    root.setProps({ zIndex: "1" });
    // hack to trigger useEffect()
    root.setProps({ zIndex: "1" });

    expect(portalEl().style.zIndex).toBe("1");
  });
});
