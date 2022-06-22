import { renderHook } from "@testing-library/react";
import useKonamiCode from "./useKonamiCode";

describe("useKonamiCode", () => {
  let _addEventListener: jest.MockedFunction<typeof window.addEventListener>;
  let _removeEventListener: jest.MockedFunction<
    typeof window.removeEventListener
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
      const utils = renderHook(() => useKonamiCode(code, callback));

      expect(_addEventListener).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
        false,
      );
      const onKeyDown = _addEventListener.mock.calls.find(
        (args) => args[0] === "keydown",
      )![1] as EventListener;

      [..."foo"].forEach((key) =>
        onKeyDown({ key } as Partial<KeyboardEvent> as KeyboardEvent),
      );
      expect(callback).toHaveBeenCalledTimes(0);

      [...code].forEach((key) =>
        onKeyDown({ key } as Partial<KeyboardEvent> as KeyboardEvent),
      );
      expect(callback).toHaveBeenCalledTimes(1);

      utils.unmount();
      expect(_removeEventListener).toHaveBeenCalledWith(
        "keydown",
        onKeyDown,
        false,
      );
    });
  });
});
