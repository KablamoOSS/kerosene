import { mount } from "enzyme";
import * as React from "react";
import { act } from "react-dom/test-utils";
import { stubProperties, JestMock } from "../../../kerosene-test/src";
import usePageVisibility from "./usePageVisibility";

const StateComponent = () => {
  const [visible, visibility] = usePageVisibility();
  return (
    <span data-visibility={visibility}>{visible ? "visible" : "hidden"}</span>
  );
};

const RefComponent = () => {
  const visibility = usePageVisibility(false);
  return <span data-visibility={visibility} />;
};

describe("usePageVisibility", () => {
  let restoreDocument: () => void;
  let addEventListener: JestMock<typeof document.addEventListener>;
  let removeEventListener: JestMock<typeof document.removeEventListener>;
  let hidden: boolean | undefined;
  beforeEach(() => {
    hidden = undefined;
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    restoreDocument = stubProperties(document, {
      addEventListener: { configurable: true, value: addEventListener },
      removeEventListener: { configurable: true, value: removeEventListener },
      hidden: { configurable: true, get: () => hidden! },
    });
  });

  afterEach(() => {
    restoreDocument();
  });

  it("should be useable in output and as a ref when useState===true", () => {
    hidden = false;
    const root = mount(<StateComponent />);
    const getRef = () =>
      root.find("span").prop("data-visibility") as React.RefObject<boolean>;

    expect(root).toHaveText("visible");
    expect(getRef()).toEqual({ current: true });

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
      false,
    );
    const onVisibilityChange = addEventListener.mock
      .calls[0][1] as EventListener;

    hidden = true;
    act(() => {
      onVisibilityChange((Symbol("Event") as unknown) as Event);
    });
    expect(root).toHaveText("hidden");
    expect(getRef()).toEqual({ current: false });

    root.unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      onVisibilityChange,
      false,
    );
  });

  it("should be usable as a ref when useState===false", () => {
    hidden = false;
    const root = mount(<RefComponent />);
    const getRef = () =>
      root.find("span").prop("data-visibility") as React.RefObject<boolean>;

    expect(getRef()).toEqual({ current: true });

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
      false,
    );
    const onVisibilityChange = addEventListener.mock
      .calls[0][1] as EventListener;

    hidden = true;
    act(() => {
      onVisibilityChange((Symbol("Event") as unknown) as Event);
    });
    expect(getRef()).toEqual({ current: false });

    root.unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      onVisibilityChange,
      false,
    );
  });

  it("should fallback to always visible when the page visibility API is not available", () => {
    const root = mount(<StateComponent />);
    expect(root).toHaveText("visible");
  });
});
