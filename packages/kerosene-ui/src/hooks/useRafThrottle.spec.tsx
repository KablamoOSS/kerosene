import { mount } from "enzyme";
import * as React from "react";
import _rafThrottle from "../utils/rafThrottle";
import useRafThrottle from "./useRafThrottle";

jest.mock("../utils/rafThrottle");

const StubComponent = ({ ...props }) => <div {...props} />;

const rafThrottle = _rafThrottle as jest.Mock<
  ReturnType<typeof _rafThrottle>,
  Parameters<typeof _rafThrottle>
>;
const cancel: jest.Mock<void, []> = jest.fn();
rafThrottle.mockImplementation(<T extends any[]>(fn: (...args: T) => void) =>
  Object.assign((...args: T) => fn(...args), { cancel }),
);

describe("#useRafThrottle", () => {
  it("should throttle the callback with rafThrottle and automatically cancel on unmount", () => {
    const callback = jest.fn();
    const Component = ({ onClick }: { onClick: () => void }) => {
      const throttled = useRafThrottle(onClick);
      return <StubComponent throttled={throttled} />;
    };
    const root = mount(<Component onClick={callback} />);
    // hack to trigger useEffect()
    root.setProps({ onClick: callback });
    expect(rafThrottle).toHaveBeenCalledTimes(1);
    const throttled = () =>
      root.find(StubComponent).prop("throttled") as ReturnType<
        typeof useRafThrottle
      >;
    throttled()();
    expect(callback).toHaveBeenCalledTimes(1);

    throttled().cancel();
    expect(cancel).toHaveBeenCalledTimes(1);

    const nextCallback = jest.fn();
    root.setProps({ onClick: nextCallback });
    // hack to trigger useEffect()
    root.setProps({ onClick: nextCallback });
    throttled()();
    expect(nextCallback).toHaveBeenCalledTimes(1);

    cancel.mockClear();
    root.unmount();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
