# 🔥 Kerosene-ui

```
yarn add @kablamo/kerosene-ui

npm install @kablamo/kerosene-ui
```

## Available Components

### `<ShowWhen />`

## Utility Types

### `UnwrapComponent<T>`

Unwraps the decorated typings from a decorator-wrapped components to provide the original type of the underlying component. Useful in unit testing when stubbing decorators with the identity function.

## React Hooks

### `useInterval(callback, delay)`

Custom hook that makes `setInterval` work declaritively with hooks. See https://overreacted.io/making-setinterval-declarative-with-react-hooks/ for more details.

### `useKonamiCode(code, callback)`

Custom hook which listens for keydown events for the specified `code` and triggers the callback when the code is entered.

### `usePageVisibility(useState = true)`

Custom hook which listens to the page visibility API. Returns either a 2-tuple containing the state of page visibility and a ref containing the same, or just a ref if `useState === false`.

### `usePopup(zIndex?, inside?)`

Custom hook which creates an element with which to use as a target for `ReactDOM.createPortal()`. This hook also keeps tracking of the bounding rect of the element attached to the `ref` so that the `rect` coordinations may be used to position the portal element.

Returns `{ open, setOpen, ref, rect, portalEl, scrollX, scrollY }`.

### `usePrevious(value, initialValue?)`

Custom hook which remembers the value from the previous render.

This hook is generally useful when the current render relies on data from the previous render. As an example, you may want to transition a value between renders with a library like [react-spring](https://github.com/react-spring/react-spring) using a multiplier that scales from 0 to 1. During the transition, the value will look something like `value * multiplier + previous * (1 - multiplier)` where the multiplier fades between the `previous` and new `value`.

### `useRafThrottle(callback)`

Custom hook which throttles the provided callback with `requestAnimationFrame`.

### `useRect(disable?, eventList?)`

Custom hook which measures the bounding rect of the element attached to `ref`. Listens to window resize events and any scroll event on the page, plus any extra event names passed to `eventList`. Stops listening when `disable` is set to `true`.

Returns `[ref, rect, { scrollX, scrollY }]`.

## Available functions

### `getSafeAreaInsets()`

Injects an element into the DOM to measure the [CSS environment variables](https://developer.mozilla.org/en-US/docs/Web/CSS/env) for the safe area insets for devices with non-rectangular displays (like iPhone X, Pixel 3 XL, Galaxy S10, etc.) and returns the measured values.

### `getTextWidth(text, font)`

Uses 2D Canvas to calculate the width of the provided `text` with the provided `font` details.

### `getViewportDimensions()`

Calculates the `height` and `width` of the current viewport. On iOS, PWAs report `window.innerHeight` and `window.innerWidth` incorrectly. This uses the `screen` dimensions instead in that case.

### `isInViewport(element)`

Returns whether or not the provided `element` is inside the viewport.

### `isPwa()`

Returns whether or not the current page is being displayed in a Progressive Web App.

### `measureCSSProperty(element, property, value)`

Measures a CSS `property` at the provided `element` by injecting a `<noscript />` element and setting the style `property` to `value` and measuring with `window.getComputedStyle`.

### `mergeRefs(...refs)`

Returns a new callback ref that effectively merges all provided `refs`.

### `rafThrottle(callback)`

Returns a throttled version of the provided `callback`. Uses `requestAnimationFrame` to throttle. To cancel any pending async operations, call `.cancel()` on the throttled version of the function.

### `waitForRepaint()`

Returns a `Promise` that waits for a repaint/reflow to occur. May be cancelled by calling `.cancel()` on the returned `Promise`.

## Useful constants

### `ADD_EVENT_LISTENER_PASSIVE_OPTIONS`

Returns `{ passive: true }` when passive event listeners are supported, otherwise `false`.

### `REMOVE_EVENT_LISTENER_PASSIVE_OPTIONS`

Returns `{}` when passive event listeners are supported, otherwise `false`.

### `ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS`

Returns `{ capture: true, passive: true }` when capture passive event listeners are supported, otherwise `true`.

### `REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS`

Returns `{ capture: true }` when capture passive event listeners are supported, otherwise `true`.

---

kablamo.com.au
