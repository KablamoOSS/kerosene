import type { Mutable } from "@kablamo/kerosene";
import { renderHook } from "@testing-library/react";
import * as React from "react";
import useInlineCSS from "./useInlineCSS";

describe("useInlineCSS", () => {
  it.each([
    {
      name: "html",
      selector: "html",
      element: document.documentElement,
    },
    {
      name: "html",
      element: document.documentElement,
    },
    {
      name: "body",
      selector: "body",
      element: document.body,
    },
  ] as const)(
    "should apply an inline style to the $selector element for selector=$selector",
    ({ element, selector }) => {
      const { unmount } = renderHook(() =>
        useInlineCSS(
          { property: "overflow", value: "hidden", priority: "important" },
          selector,
        ),
      );
      expect(element).toHaveStyle("overflow: hidden");

      unmount();
      expect(element).not.toHaveStyle("overflow: hidden");
    },
  );

  it("should apply an inline style to the ref element", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    try {
      const ref = React.createRef<HTMLElement>();
      (ref as Mutable<typeof ref>).current = element;

      const { unmount } = renderHook(() =>
        useInlineCSS({ property: "--my-var", value: "1" }, ref),
      );
      expect(element).toHaveStyle({ "--my-var": "1" });

      unmount();
      expect(element).not.toHaveStyle({ "--my-var": "1" });
    } finally {
      element.remove();
    }
  });

  it("should ignore an empty ref", () => {
    const ref = React.createRef<HTMLElement>();
    const { unmount } = renderHook(() =>
      useInlineCSS({ property: "--my-var", value: "1" }, ref),
    );
    unmount();
  });
});
