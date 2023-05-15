import { useSyncExternalStore } from "use-sync-external-store/shim";
import {
  ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
  REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
} from "../utils/listeners";

const FOCUS_EVENTS = ["blur", "focus"] as const;

const subscribe = (callback: () => void) => {
  FOCUS_EVENTS.forEach((name) =>
    window.addEventListener(
      name,
      callback,
      ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
    ),
  );
  return () =>
    FOCUS_EVENTS.forEach((name) =>
      window.removeEventListener(
        name,
        callback,
        REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
      ),
    );
};

const getSnapshot = () => {
  // In React 16 & 17, the `useSyncExternalStore` shim always uses `getSnapshot()`, even on the server
  /* istanbul ignore if */
  if (typeof document === "undefined") return false;

  return !!document.querySelector(
    typeof CSS !== "undefined" && CSS.supports?.("selector(:focus-visible)")
      ? ":focus-visible"
      : ":focus",
  );
};

const getServerSnapshot = () => false;

/**
 * Custom hook which returns whether there is any element on the page which has the :focus-visible pseudo class
 */
export default function useFocusVisible() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
