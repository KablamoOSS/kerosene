import "core-js/features/array/flat-map";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-enzyme";

configure({ adapter: new Adapter() });

Object.assign(window, {
  requestAnimationFrame: (callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 17),
  cancelAnimationFrame: (handle: number) => clearTimeout(handle),
});

// Ignore React warnings about non-string props on intrinsic elements for testing
const consoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  const [first] = args;
  if (
    typeof first === "string" &&
    first.startsWith("Warning: Invalid value for prop")
  )
    return;
  consoleError(...args);
};
