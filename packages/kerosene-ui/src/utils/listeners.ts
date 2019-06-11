import { noop } from "lodash";

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
 */
let isPassiveSupported = false;
let isCapturePassiveSupported = false;

try {
  const options = {
    get passive() {
      isPassiveSupported = true;
      return true;
    },
  };
  window.addEventListener("test", noop, options);
  window.removeEventListener("test", noop, {});
} catch (e) {
  isPassiveSupported = false;
}

try {
  const options = {
    get capture() {
      isCapturePassiveSupported = isPassiveSupported;
      return true;
    },
    passive: true,
  };
  window.addEventListener("test", noop, options);
  window.removeEventListener("test", noop, { capture: true });
} catch (e) {
  isCapturePassiveSupported = false;
}

export const ADD_EVENT_LISTENER_PASSIVE_OPTIONS = isPassiveSupported
  ? ({ passive: true } as const)
  : false;
export const REMOVE_EVENT_LISTENER_PASSIVE_OPTIONS = isPassiveSupported
  ? ({} as const)
  : false;

export const ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS = isCapturePassiveSupported
  ? ({
      capture: true,
      passive: true,
    } as const)
  : true;
export const REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS = isCapturePassiveSupported
  ? ({
      capture: true,
    } as const)
  : true;
