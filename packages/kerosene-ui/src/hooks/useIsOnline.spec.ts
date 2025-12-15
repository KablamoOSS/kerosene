// @vitest-environment jsdom

import { stubProperties } from "@kablamo/kerosene-test";
import { renderHook } from "@testing-library/react";
import { identity } from "lodash";
import { act } from "react";
import useIsOnline from "./useIsOnline";

describe("useIsOnline", () => {
  let restoreNavigator: () => void;
  let onLine: boolean;
  const update = (_onLine: boolean) => {
    onLine = _onLine;
    const event = new Event(onLine ? "online" : "offline", {
      cancelable: false,
    });
    act(() => {
      window.dispatchEvent(event);
    });
  };
  beforeEach(() => {
    onLine = true;
    restoreNavigator = stubProperties(navigator, {
      onLine: { configurable: true, get: () => onLine },
    });
  });

  afterEach(() => {
    restoreNavigator();
  });

  it("should always return true during hydration and update after", () => {
    update(false);

    const monitor = vi.fn<(value: boolean) => boolean>(identity);
    const utils = renderHook(() => monitor(useIsOnline()), { hydrate: true });

    // Hydration
    expect(monitor.mock.calls[0]![0]).toBe(true);

    expect(utils.result.current).toEqual(false);

    update(true);
    expect(utils.result.current).toEqual(true);

    utils.unmount();
  });
});
