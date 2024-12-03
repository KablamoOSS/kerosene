import * as React from "react";

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * Custom hook which returns the current value of `navigator.onLine`, watching for changes via the
 * `"online"` and `"offline"` events
 */
export default function useIsOnline() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
