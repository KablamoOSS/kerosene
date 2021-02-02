export interface ViewportDimensions {
  height: number;
  width: number;
}

const MOBILE_SAFARI_REGEX = /mobile\/\w+\ssafari/i;

/**
 * Returns the viewport dimensions
 *
 * iOS PWAs with no browser chrome (standalone mode) report `window.innerHeight` and `window.innerWidth` incorrectly
 * as a square with sides equal to the minimum of the height and width when the device is rotated.
 *
 * Instead, `screen.height` and `screen.width` may be used to measure the device height/width in its default
 * orientation (portrait) in tandem with media query to detect the current orientation so that the correct dimensions
 * are used. This cannot be used in regular Safari as the screen dimensions do not match the actual size of the viewport.
 */
export default function getViewportDimensions(): ViewportDimensions {
  // This will be true for an iOS PWA with no browser chrome
  if (
    MOBILE_SAFARI_REGEX.test(navigator.userAgent) &&
    (navigator as Navigator & { standalone?: boolean }).standalone
  ) {
    const max = Math.max(window.screen.height, window.screen.width);
    const min = Math.min(window.screen.height, window.screen.width);
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    return { height: isPortrait ? max : min, width: isPortrait ? min : max };
  }

  return { height: window.innerHeight, width: window.innerWidth };
}
