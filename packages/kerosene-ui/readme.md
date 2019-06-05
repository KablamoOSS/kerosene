# 🔥 Kerosene-ui

```
yarn add @kablamo/kerosene-ui

npm install @kablamo/kerosene-ui
```

## Available Components

### `<ShowWhen />`

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

### `waitForRepaint()`

Returns a `Promise` that waits for a repaint/reflow to occur. May be cancelled by calling `.cancel()` on the returned `Promise`.

---

kablamo.com.au
