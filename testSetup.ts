import "@testing-library/jest-dom";
import "core-js/features/array/flat";
import "core-js/features/array/flat-map";
import { setImmediate } from "timers";

// Required for Jest 27
global.setImmediate = setImmediate;

Object.assign(window, {
  requestAnimationFrame: (callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 17),
  cancelAnimationFrame: (handle: number) => clearTimeout(handle),
});
