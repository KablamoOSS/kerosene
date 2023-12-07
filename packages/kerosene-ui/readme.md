# 🔥 Kerosene-ui

```
yarn add @kablamo/kerosene-ui

npm install @kablamo/kerosene-ui
```

## Available Components

### `<CurrentTimeProvider />`

Context Provider for the CurrentTimeEmitter used internally by the `useCurrentTime` hook. Recommended for use when using SSR so that on initial render and hydration a consistent and correct time will be used.

### `<ShowWhen />`

### `<TimeZoneProvider />`

Context Provider for the `useTimeZone` hook. May be used to override the default `"Etc/UTC"` `timeZone` value during SSR and hydration.

## Utility Types

### `UnwrapComponent<T>`

Unwraps the decorated typings from a decorator-wrapped components to provide the original type of the underlying component. Useful in unit testing when stubbing decorators with the identity function.

## React Hooks

### `useAbortController()`

Custom hook which manages a series of `AbortController`s, aborting the previous when requesting the `next`, and aborting the final controller on unmount.

### `useCollapsable(open, { immediate?, transitionDuration?, transitionTimingFunction? }?)`

Custom hook which manages height transitions on the element that `ref` is applied to using `maxHeight`.

### `useCurrentTime(period?)`

Custom hook which uses a shared `CurrentTimeEmitter` class to listen for time updates in a performant way. Will update at least once every `period` milliseconds whilst the page is visible. Uses only a single interval to avoid overloading the browser when there are a large number of components listening to the time. Whilst this hook will attempt to updates components only as-required, it is not recommended to use this hook for extremely frequent updates (sub 1-second) and for such specific cases, `requestAnimationFrame` should be used instead.

### `useFocusVisible()`

Custom hook which returns whether there is any element on the page which has the :focus-visible pseudo class.

### `useInlineCSS({ property, value, priority? }, refOrSelector?)`

Custom hook which applies a CSS `property` `value` with `priority` to the element provided in `refOrSelector`.

### `useInterval(callback, delay)`

Custom hook that makes `setInterval` work declaritively with hooks. See https://overreacted.io/making-setinterval-declarative-with-react-hooks/ for more details.

### `useKonamiCode(code, callback)`

Custom hook which listens for keydown events for the specified `code` and triggers the callback when the code is entered.

### `useLocalStorage(key, defaultValue, isT)`

Custom hook which allows reading/writing of `localStorage` in a manner similar to `React.useState`.

### `useMediaQuery(query, { defaultMatches? }?)`

Custom hook which returns the result of the provided media `query`, watching for changes.

### `useMergedRefs(...refs)`

Custom hook which creates a new callback ref that effectively merges all provided `refs`.

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

### `useSessionStorage(key, defaultValue, isT)`

Custom hook which allows reading/writing of `sessionStorage` in a manner similar to `React.useState`.

### `useStableIdentity(value, isEqual?)`

Custom hook which provides a stable identity between renders for `value` which is equal to the previous value according to the `isEqual` function.

### `useTimeZone()`

Custom hook which returns the current `timeZone`.

Defaults to `"Etc/UTC"` during SSR and hydration, but this may be overriden with a provider `<TimeZoneProvider ssrTimeZone={timeZone}>`. Ensure that the value used during SSR and hydration is the same.

### `useUpdatingRef(value)`

Custom hook which creates a ref to the `value` which is kept up-to-date after each render in `useLayoutEffect`.

## SVG Utilities

### `d`

A collection of SVG path construction utilities which add documentation to available path commands.

### `point2DPlusPolarVector([x, y], [r, theta])`

Adds the vector `[r, theta]` to Point2D `[x, y]`

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

### `waitForRepaint({ signal? }?)`

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

## React Query

We also include some useful helpers and components when working with [React Query][https://react-query.tanstack.com/]. These aren't included in the main entrypoint for `@kablamo/kerosene-ui`, and instead must be imported like this:

```ts
import {} from "@kablamo/kerosene-ui/react-query";
```

### `isDefinedQueryObserverResult(query)`

Returns whether a given query has a defined result. This includes the success state of the query, as well as the states for refetch in progress, as well as the refetch error state with stale data.

### `isQueryObserverLoadingErrorResult(query)`

Returns whether a given query is in the error state with no defined result. This includes the error state when data is refetching.

### `isQueryObserverLoadingResult(query)`

Returns whether a given query is in the loading state with no defined result. This includes the error state when data is refetching.

### `<QueryBoundary />`

Utility component for managing the loading and error states for a single React Query query. Specifying the query automatically infers the type of the success state of the query in the render prop children (if used).

### `<QueriesBoundary />`

Utility component for managing the loading and error states for multiple React Query queries. Specifying the queries automatically infers the types of the success state of the queries in the render prop children (if used).

### `<SuspenseBoundary />`

---

kablamo.com.au
