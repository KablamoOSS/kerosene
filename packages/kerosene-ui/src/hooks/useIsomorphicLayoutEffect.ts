import * as React from "react";

/**
 * Please avoid using this unless it is absolutely required. Most of the time, what you actually want is just
 * `React.useEffect()`, or may be accomplished more correctly with
 * `React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`.
 *
 * Most of the time `React.useEffect()` should be used if what you need doesn't need to happen before the render is
 * ready for the user, e.g. making a network call.
 *
 * Sometimes, however, you don't want a brief intermediate state shown to the user if the result is available
 * immediately on the client and this is where `React.useLayoutEffect()` is useful. For hydration from SSR, this
 * actually makes no difference (and hence the reason why React recommends you just use `React.useEffect()`), since the
 * intermediate state would be shown anyway before React finishes hydrating.
 *
 * But when moving between pages client side, you want to avoid an intermediate flash which could result after a change
 * in `React.useEffect()`, but not `React.useLayoutEffect()` (which is called synchronously after render). It may also
 * be worth checking whether `React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` is a better fit
 * for your use case, and would avoid a double render.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export default useIsomorphicLayoutEffect;
