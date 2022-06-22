import { noop } from "lodash";
import * as React from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

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
  const [matches, setMatches] = React.useState(defaultMatches);

  useIsomorphicLayoutEffect(() => {
    // This is necessary due to a bug in Safari where unsubscribing from a MediaQueryList does not work
    let subscribed = true;

    // JSDOM
    if (typeof window.matchMedia !== "function") {
      return noop;
    }

    const list = window.matchMedia(query);

    const update = () => {
      // This is neccessary due to a bug in Safari
      if (!subscribed) return;

      setMatches(list.matches);
    };

    // NOTE: using `addListener` (deprecated) instead of `addEventListener` as Safari has only recently added support
    list.addListener(update);

    update();

    return () => {
      list.removeListener(update);
      subscribed = false;
    };
  }, [query]);

  return matches;
}
