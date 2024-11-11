import * as React from "react";

declare global {
  interface WindowEventHandlersEventMap {
    timezonechange: Event;
  }

  interface WindowEventHandlers {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ontimezonechange?: ((this: Window, ev: Event) => any) | null;
  }
}

function subscribe(callback: () => void): () => void {
  // @see https://github.com/whatwg/html/pull/3047
  if ("ontimezonechange" in window) {
    window.addEventListener("timezonechange", callback);
    return () => {
      window.removeEventListener("timezonechange", callback);
    };
  }

  // If the "timezonechange" event is not supported, use "visibilitychange" as a proxy
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getSnapshot() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const SSRTimeZoneContext = React.createContext("Etc/UTC");

/**
 * Custom hook which returns the current `timeZone`.
 *
 * Defaults to `"Etc/UTC"` during SSR and hydration, but this may be overriden with a provider
 * `<TimeZoneProvider ssrTimeZone={timeZone}>`. Ensure that the value used during SSR and hydration is the same.
 * @returns IANA tz database identifier
 * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */
export default function useTimeZone() {
  const ssrTimeZone = React.useContext(SSRTimeZoneContext);
  const getServerSnapshot = React.useCallback(() => ssrTimeZone, [ssrTimeZone]);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export interface TimeZoneProviderProps {
  children?: React.ReactNode;
  /** IANA tz database identifier */
  ssrTimeZone: string;
}

/**
 * Context Provider for the `useTimeZone` hook. May be used to override the default `"Etc/UTC"` `timeZone` value during
 * SSR and hydration.
 * @param props.children
 * @param props.ssrTimeZone IANA tz database identifier
 */
export const TimeZoneProvider = ({
  children,
  ssrTimeZone,
}: TimeZoneProviderProps) => (
  <SSRTimeZoneContext.Provider value={ssrTimeZone}>
    {children}
  </SSRTimeZoneContext.Provider>
);
