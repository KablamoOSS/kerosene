import * as React from "react";
// Using shim for React 16 & 17 support instead of React.useSyncExternalStore
import { useSyncExternalStore } from "use-sync-external-store/shim";

const getServerSnapshot = () => true;

export default function usePageVisibility(
  useState?: true,
): [boolean, React.RefObject<boolean>];

export default function usePageVisibility(
  useState: false,
): React.RefObject<boolean>;

/**
 * Custom React Hook which listens to the page visibility API and provides a ref
 * @param [useState] Whether or not to use state (default) or ref for the current visibility
 * @returns If `useState` is `true` (or not set) a 2-tuple containing a boolean and a ref, otherwise just a ref
 */
export default function usePageVisibility(
  useState = true,
): [boolean, React.RefObject<boolean>] | React.RefObject<boolean> {
  const visibility = React.useRef(true);

  const subscribe = React.useCallback((callback: () => void) => {
    document.addEventListener("visibilitychange", callback);

    return () => document.removeEventListener("visibilitychange", callback);
  }, []);

  const getSnapshot = React.useCallback(() => {
    // In React 16 & 17, the `useSyncExternalStore` shim always uses `getSnapshot()`, even on the server
    if (typeof document === "undefined") return true;

    const { hidden = false } = document;

    visibility.current = !hidden;
    // Always returning true when not using state to prevent component updates
    return useState ? visibility.current : true;
  }, [useState]);

  const visible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useState
    ? [visible, visibility as React.RefObject<boolean>]
    : (visibility as React.RefObject<boolean>);
}
