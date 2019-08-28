import { mount } from "enzyme";
import * as React from "react";
import usePrevious from "./usePrevious";
import { act } from "react-dom/test-utils";

describe("usePrevious", () => {
  it("should remember the previous value, and default to undefined for the first render", () => {
    const Component = ({ value }: { value: number }) => {
      const previous = usePrevious(value);
      return <span data-value={previous} />;
    };

    const root = mount(<Component value={1} />);
    const getValue = () => root.find("span").prop("data-value");

    expect(getValue()).toBe(undefined);

    root.setProps({ value: 2 });
    expect(getValue()).toBe(1);
  });

  it("should use the initialValue for initial render, remembering the value from previous render", () => {
    const Component = ({ value }: { value: number }) => {
      const previous = usePrevious(value, 0);
      return <span data-value={previous} />;
    };

    const root = mount(<Component value={1} />);
    const getValue = () => root.find("span").prop("data-value");

    expect(getValue()).toBe(0);

    root.setProps({ value: 2 });
    expect(getValue()).toBe(1);
  });
});
