import { render } from "@testing-library/react";
import * as React from "react";
import useMergedRefs from "./useMergedRefs";

describe("#useMergedRefs", () => {
  const Component = ({
    refs,
  }: {
    refs: ReadonlyArray<React.Ref<HTMLDivElement | null> | undefined>;
  }) => {
    const setRef = useMergedRefs(...refs);
    return <div data-testid="ref" ref={setRef} />;
  };

  it("should merge multiple refs", () => {
    const ref = React.createRef<HTMLDivElement>();
    let node2: HTMLDivElement | null = null;
    const ref2 = (instance: typeof node2) => {
      node2 = instance;
    };
    const result = render(<Component refs={[ref, ref2, null, undefined]} />);
    expect(ref.current).toBe(result.getByTestId("ref"));
    expect(node2).toBe(result.getByTestId("ref"));

    result.unmount();
    expect(ref.current).toBe(null);
    expect(node2).toBe(null);
  });

  it("should throw if a callback refs returns a cleanup function", () => {
    const cleanup: jest.Mock<void, []> = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ref = jest.fn((_instance: HTMLDivElement | null) => cleanup);
    expect(() => render(<Component refs={[ref]} />)).toThrow();
  });
});
