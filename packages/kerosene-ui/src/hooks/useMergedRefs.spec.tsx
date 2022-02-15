import { render } from "@testing-library/react";
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
      return <div data-testid="ref" ref={setRef} />;
    };

    const ref = React.createRef<HTMLDivElement>();
    let node: HTMLDivElement | null = null;
    const ref2 = (instance: typeof node) => (node = instance);
    const result = render(<Component refs={[ref, ref2, null, undefined]} />);
    expect(ref.current).toBe(result.getByTestId("ref"));
    expect(node).toBe(result.getByTestId("ref"));
  });
});
