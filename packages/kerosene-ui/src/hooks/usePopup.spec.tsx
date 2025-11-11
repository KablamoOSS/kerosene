// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import last from "lodash/last";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import waitForRepaint from "../utils/waitForRepaint";
import usePopup from "./usePopup";

const _addEventListener = vi.spyOn(window, "addEventListener");
Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
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
  it("should create an element for a portal and return the props", async () => {
    const Component = ({ zIndex }: { zIndex?: string | null }) => {
      const { open, setOpen, ref, rect, portalEl, scrollX, scrollY } =
        usePopup(zIndex);

      return (
        <>
          <div ref={ref as React.Ref<HTMLDivElement>} data-testid="ref">
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
            >
              Click me
            </button>
          </div>
          {portalEl.current &&
            ReactDOM.createPortal(
              <p
                data-testid="popup"
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
        </>
      );
    };

    const result = render(<Component />);
    result.rerender(<Component />);

    const onClickOutside = (e: Event) =>
      act(() => {
        (
          last(
            _addEventListener.mock.calls.filter((args) => args[0] === "click"),
          )![1] as EventListener
        )(e);
      });

    const popup = () => screen.getByTestId("popup");

    const open = () => popup().getAttribute("data-open") === "true";

    expect(open()).toBe(false);
    expect(popup()).toHaveTextContent("Test");

    const portalEl = () => document.body.lastChild as HTMLDivElement;
    (
      Object.entries({
        position: "absolute",
        top: "0px",
        left: "0px",
        bottom: "0px",
        right: "0px",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: "",
      }) as [keyof CSSStyleDeclaration, string | null][]
    ).forEach(([key, value]) => expect(portalEl().style[key]).toBe(value));

    await userEvent.click(result.getByRole("button"));

    await act(async () => {
      await waitForRepaint();
    });

    expect(open()).toBe(true);
    expect(popup().style.top).toBe(`${3 + 7}px`);
    expect(popup().style.left).toBe(`${6 + 2}px`);
    expect(popup().style.width).toBe(`${4 - 2}px`);

    [result.getByTestId("ref"), portalEl()].forEach((target) => {
      onClickOutside({
        target,
      } as Partial<Event> as Event);

      expect(open()).toBe(true);
    });

    onClickOutside({
      target: document.body,
    } as Partial<Event> as Event);
    expect(open()).toBe(false);

    result.rerender(<Component zIndex="1" />);

    expect(portalEl()).toHaveStyle({
      zIndex: "1",
    });
  });
});
