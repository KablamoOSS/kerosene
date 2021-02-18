import { mount } from "enzyme";
import * as React from "react";
import useAbortController from "./useAbortController";

describe("#useAbortController", () => {
  it("should manage a series of AbortControllers", () => {
    const Component = ({
      resultRef,
    }: {
      resultRef: React.MutableRefObject<ReturnType<typeof useAbortController>>;
    }) => {
      const result = useAbortController();
      // eslint-disable-next-line no-param-reassign
      resultRef.current = result;
      return null;
    };
    const result = ({ current: undefined } as Partial<
      React.MutableRefObject<ReturnType<typeof useAbortController>>
    >) as React.MutableRefObject<ReturnType<typeof useAbortController>>;
    const root = mount(<Component resultRef={result} />);
    expect(result.current.ref).toEqual({ current: undefined });

    const first = result.current.next();
    expect(first).toBeInstanceOf(AbortController);
    expect(first.signal.aborted).toBe(false);
    expect(result.current.ref.current).toBe(first);

    const second = result.current.next();
    expect(second).toBeInstanceOf(AbortController);
    expect(second.signal.aborted).toBe(false);
    expect(result.current.ref.current).toBe(second);

    expect(first.signal.aborted).toBe(true);

    root.unmount();
    expect(second.signal.aborted).toBe(true);
  });
});
