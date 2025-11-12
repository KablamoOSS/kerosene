import noop from "lodash/noop";
import * as React from "react";

export interface UseMediaQueryOptions {
  /**
   * Default for SSR
   * @default false
   */
  defaultMatches?: boolean;
}

/**
 * Custom hook which returns the result of the provided media `query`, watching for changes
 * @param query `query` passed to `window.matchMedia(query)`
 * @param options
 */
export default function useMediaQuery(
  query: string,
  { defaultMatches = false }: UseMediaQueryOptions = {},
): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      // This branch should only occur in tests
      if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      ) {
        return noop;
      }

      // This is necessary due to a bug in Safari where unsubscribing from a MediaQueryList does not work
      const controller = new AbortController();

      const onUpdate = () => {
        /* istanbul ignore if */
        if (controller.signal.aborted) return;
        callback();
      };

      const list = window.matchMedia(query);

      // NOTE: using `addListener` (deprecated) instead of `addEventListener` for Safari <14 support
      list.addListener(onUpdate);

      return () => {
        list.removeListener(onUpdate);
        controller.abort();
      };
    },
    [query],
  );

  const getSnapshot = React.useCallback(() => {
    // In React 16 & 17, the `useSyncExternalStore` shim always uses `getSnapshot()`, even on the server
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return defaultMatches;
    }

    return window.matchMedia(query).matches;
  }, [defaultMatches, query]);

  const getServerSnapshot = React.useCallback(
    () => defaultMatches,
    [defaultMatches],
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
