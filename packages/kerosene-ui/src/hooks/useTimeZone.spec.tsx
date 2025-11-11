// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import identity from "lodash/identity";
import type { Mock } from "vitest";
import useTimeZone, { TimeZoneProvider } from "./useTimeZone";

describe("useTimeZone", () => {
  let onRender: Mock<(value: string) => string>;
  let resolvedOptions: Mock<Intl.DateTimeFormat["resolvedOptions"]>;
  beforeEach(() => {
    window.ontimezonechange = null;
    onRender = vi.fn().mockImplementation(identity);
    resolvedOptions = vi.spyOn(
      Intl.DateTimeFormat.prototype,
      "resolvedOptions",
    );
    resolvedOptions.mockReturnValue({
      timeZone: "Australia/Sydney",
    } as Intl.ResolvedDateTimeFormatOptions);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return Australia/Sydney", () => {
    const { result } = renderHook(() => useTimeZone());
    expect(result.current).toBe("Australia/Sydney");
  });

  it("should return Etc/UTC during hydration", () => {
    renderHook(() => onRender(useTimeZone()), { hydrate: true });
    expect(onRender).toHaveBeenNthCalledWith(1, "Etc/UTC");
    expect(onRender).toHaveBeenLastCalledWith("Australia/Sydney");
  });

  it("should return ssrTimeZone from context during hydration", () => {
    renderHook(() => onRender(useTimeZone()), {
      hydrate: true,
      wrapper({ children }) {
        return (
          <TimeZoneProvider ssrTimeZone="Australia/Brisbane">
            {children}
          </TimeZoneProvider>
        );
      },
    });
    expect(onRender).toHaveBeenNthCalledWith(1, "Australia/Brisbane");
    expect(onRender).toHaveBeenLastCalledWith("Australia/Sydney");
  });

  it("should response to timezonechange events", () => {
    const { result } = renderHook(() => useTimeZone());
    resolvedOptions.mockReturnValue({
      timeZone: "Australia/Brisbane",
    } as Intl.ResolvedDateTimeFormatOptions);
    act(() => {
      window.dispatchEvent(new Event("timezonechange"));
    });
    expect(result.current).toBe("Australia/Brisbane");
  });

  it("should response to visibilitychange events when ontimezonechange is not supported", () => {
    delete window.ontimezonechange;
    const { result } = renderHook(() => useTimeZone());
    resolvedOptions.mockReturnValue({
      timeZone: "Australia/Brisbane",
    } as Intl.ResolvedDateTimeFormatOptions);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(result.current).toBe("Australia/Brisbane");
  });
});
