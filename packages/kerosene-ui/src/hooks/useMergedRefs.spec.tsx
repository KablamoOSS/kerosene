import { mount } from "enzyme";
import * as React from "react";
import useMergedRefs from "./useMergedRefs";

describe("#useMergedRefs", () => {
  it("should merge multiple refs", () => {
    const Component = ({
      refs,
    }: {
      refs: ReadonlyArray<React.Ref<HTMLDivElement> | undefined>;
    }) => {
      const setRef = useMergedRefs(...refs);
      return <div ref={setRef} />;
    };

    const ref = React.createRef<HTMLDivElement>();
    let node: HTMLDivElement | null = null;
    const ref2 = (instance: typeof node) => (node = instance);
    const root = mount(<Component refs={[ref, ref2, null, undefined]} />);
    expect(ref.current).toBe(root.find("div").getDOMNode());
    expect(node).toBe(root.find("div").getDOMNode());
  });
});
