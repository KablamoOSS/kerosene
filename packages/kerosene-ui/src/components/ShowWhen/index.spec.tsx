// @vitest-environment jsdom

import { render } from "@testing-library/react";
import ShowWhen from ".";

const text = "Test";

describe("ShowWhen", () => {
  it.each([
    {
      name: "Should return Test as text",
      when: true,
      children: text,
    },
    {
      name: "Should return Test in a <span />",
      when: true,
      children: <span>{text}</span>,
    },
    {
      name: "Should return null",
      when: false,
      children: text,
    },
  ])("ShowWhen %j", ({ when, children }) => {
    const result = render(<ShowWhen when={when}>{children}</ShowWhen>);

    if (when === false) {
      expect(result.queryByText(text)).not.toBeInTheDocument();
    }

    if (when === true) {
      expect(result.queryByText(text)).toBeInTheDocument();

      if (typeof children !== "string") {
        expect(result.container.querySelector("span")).toBeInTheDocument();
      }
    }
  });
});
