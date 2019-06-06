import { mount } from "enzyme";
import * as React from "react";
import useKonamiCode from "./useKonamiCode";

describe("useKonamiCode", () => {
  let _addEventListener: jest.Mock<
    void,
    Parameters<typeof window.addEventListener>
  >;
  let _removeEventListener: jest.Mock<
    void,
    Parameters<typeof window.removeEventListener>
  >;

  beforeEach(() => {
    _addEventListener = jest.fn();
    _removeEventListener = jest.fn();
    window.addEventListener = _addEventListener;
    window.removeEventListener = _removeEventListener;
  });

  [
    { type: "string", code: "code" },
    {
      type: "array",
      code: [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
      ],
    },
  ].forEach(({ type, code }) => {
    it(`should listen for the correct ${type} code and call the callback`, () => {
      const callback = jest.fn();
      const Component = () => {
        useKonamiCode(code, callback);
        return null;
      };
      const root = mount(<Component />);
      // hack to trigger useEffect()
      root.setProps({});

      expect(_addEventListener).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
        false,
      );
      const onKeyDown = _addEventListener.mock.calls.find(
        args => args[0] === "keydown",
      )![1] as EventListener;

      [..."foo"].forEach(key =>
        onKeyDown(({ key } as Partial<KeyboardEvent>) as KeyboardEvent),
      );
      expect(callback).toHaveBeenCalledTimes(0);

      [...code].forEach(key =>
        onKeyDown(({ key } as Partial<KeyboardEvent>) as KeyboardEvent),
      );
      expect(callback).toHaveBeenCalledTimes(1);

      root.unmount();
      expect(_removeEventListener).toHaveBeenCalledWith(
        "keydown",
        onKeyDown,
        false,
      );
    });
  });
});
