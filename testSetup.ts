import "@testing-library/jest-dom";
import "core-js/features/array/flat";
import "core-js/features/array/flat-map";
import { noop } from "lodash";
import { setImmediate } from "timers";

// Required for Jest 27
global.setImmediate = setImmediate;

Object.assign(window, {
  matchMedia: ((query) =>
    ({
      get matches(): boolean {
        throw new Error("Not Implemented");
      },
      media: query,
      addEventListener: noop,
      removeEventListener: noop,
      onchange: null,
    } as Partial<MediaQueryList> as MediaQueryList)) as Window["matchMedia"],
  requestAnimationFrame: (callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 17),
  cancelAnimationFrame: (handle: number) => clearTimeout(handle),
});
