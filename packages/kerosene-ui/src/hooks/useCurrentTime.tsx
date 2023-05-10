import { MINUTE } from "@kablamo/kerosene";
import * as React from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";

interface CurrentTimeSubscription {
  lastUpdatedAt: number;
  listener: () => void;
  period: number;
}

class CurrentTimeEmitter {
  private currentTime: number;

  /**
   * Stores the handler returned by `setInterval`
   */
  private interval?: number;

  /**
   * Stores the current interval period. Set to `Infinity` when no interval is active
   */
  private period = Infinity;

  private subscribers: readonly CurrentTimeSubscription[] = [];

  constructor(
    /**
     * Stores the time of initial render for SSR. The default here is probably not useful for SSR, so it is strongly
     * recommended to use `<CurrentTimeProvider />` with an `ssrTime` when using SSR and hydration. But having a default
     * means that use of the `useCurrentTime()` hook will not crash when using SSR.
     */
    private ssrTime = new Date("2000-01-01T00:00:00.000Z").getTime(),
    /**
     * Stores the default interval period which will be used if none is specified
     */
    private defaultPeriod = MINUTE,
  ) {
    this.currentTime = ssrTime;
  }

  /**
   * `getSnapshot()` function used by `React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`
   */
  public readonly getCurrentTime = () => this.currentTime;

  /**
   * `getServerSnapshot()` function used by `React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`
   */
  public readonly getSsrTime = () => this.ssrTime;

  /**
   * Updates `this.currentTime` and calls all subscribers which need an update
   */
  private update = () => {
    this.currentTime = Date.now();
    this.subscribers
      .filter(
        ({ period, lastUpdatedAt }) =>
          // Include subscribers which are within half their interval period of needing an update
          this.currentTime >= lastUpdatedAt + period / 2,
      )
      .forEach((s) => {
        // eslint-disable-next-line no-param-reassign
        s.lastUpdatedAt = this.currentTime;
        s.listener();
      });
  };

  /**
   * Mark all subscribers as requiring an update as soon as the next call to `this.update()`
   */
  private markAllForUpdate = () => {
    // eslint-disable-next-line no-param-reassign
    this.subscribers.forEach((s) => (s.lastUpdatedAt = 0));
  };

  /**
   * Handles `document` `"visibilitychange"` events by disabling the interval whilst the document is hidden, and
   * re-running updates when the page is resumed.
   */
  private onVisibilityChange = () => {
    const { hidden = false } = document;

    if (hidden) {
      window.clearInterval(this.interval);
      delete this.interval;
    } else if (this.subscribers.length) {
      this.period = Math.min(...this.subscribers.map((s) => s.period))!;
      this.interval = window.setInterval(this.update, this.period);
    }

    this.markAllForUpdate();
    this.update();
  };

  public readonly subscribe = (
    listener: () => void,
    period = this.defaultPeriod,
  ) => {
    if (!this.subscribers.length) {
      // If there were previously no subscribers, start listening to the `"visibilitychange"` event
      document.addEventListener("visibilitychange", this.onVisibilityChange);
    }

    // If the new period is less than the period of the currently operating interval
    if (period < this.period) {
      // Clear the existing interval
      window.clearInterval(this.interval);
      // Update to the more frequent period of this subscriber
      this.period = period;
      // Create a new interval with the updated period
      this.interval = window.setInterval(this.update, this.period);
    }

    // Add the new subscriber
    this.subscribers = [
      ...this.subscribers,
      { listener, period, lastUpdatedAt: 0 },
    ];

    this.update();

    // Return a function which removes this subscription
    return () => {
      // Remove this subscription
      this.subscribers = this.subscribers.filter(
        (s) => s.listener !== listener,
      );

      // If there are no more subscribers after removing this one, we need to cleanup
      if (!this.subscribers.length) {
        // Clear the existing interval
        window.clearInterval(this.interval);
        delete this.interval;

        // Set the period to indicate that there is no interval
        this.period = Infinity;

        // Remove the `"visibilitychange"` listener
        document.removeEventListener(
          "visibilitychange",
          this.onVisibilityChange,
        );
      } else {
        // Find the minimum period of the remaining listeners
        const newPeriod = Math.min(...this.subscribers.map((s) => s.period));

        // If the interval period needs updating
        if (newPeriod !== this.period) {
          // Clear the existing interval
          window.clearInterval(this.interval);
          this.period = newPeriod;

          // Create a new interval with the updated period
          this.interval = window.setInterval(this.update, this.period);

          // Force an update soon, just in case the last interval was about to fire before it was cleared
          this.markAllForUpdate();
          Promise.resolve().then(() => this.update());
        }
      }
    };
  };
}

// Set up the context with a default `CurrentTimeEmitter` singleton so that the `useCurrentTime()` hook may be used
// ergonimically without `<CurrentTimeProvider />` when there is no server side rendering
const CurrentTimeEmitterContext = React.createContext(new CurrentTimeEmitter());

/**
 * Custom hook which uses a shared `CurrentTimeEmitter` class to listen for time updates in a performant way.
 * Will update at least once every `period` milliseconds whilst the page is visible. Uses only a single interval to
 * avoid overloading the browser when there are a large number of components listening to the time. Whilst this hook
 * will attempt to updates components only as-required, it is not recommended to use this hook for extremely frequent
 * updates (sub 1-second) and for such specific cases, `requestAnimationFrame` should be used instead.
 * @param period Interval period
 * @returns `currentTime`
 */
export default function useCurrentTime(period?: number): number {
  const emitter = React.useContext(CurrentTimeEmitterContext);

  const subscribe = React.useCallback(
    (callback: () => void) => {
      return emitter.subscribe(callback, period);
    },
    [emitter, period],
  );

  return useSyncExternalStore(
    subscribe,
    emitter.getCurrentTime,
    emitter.getSsrTime,
  );
}

export interface CurrentTimeProviderProps {
  children?: React.ReactNode;
  defaultPeriod?: number;
  ssrTime?: number;
}

/**
 * Context Provider for the CurrentTimeEmitter used internally by `useCurrentTime`.
 * Recommended for use when using SSR so that on initial render and hydration a consistent and correct time will be used.
 * @param props.children
 * @param props.defaultPeriod
 * @param props.ssrTime Unix epoch milliseconds for initial SSR render
 */
export const CurrentTimeProvider = ({
  children,
  defaultPeriod,
  ssrTime,
}: CurrentTimeProviderProps) => (
  <CurrentTimeEmitterContext.Provider
    value={React.useMemo(
      () => new CurrentTimeEmitter(ssrTime, defaultPeriod),
      [ssrTime, defaultPeriod],
    )}
  >
    {children}
  </CurrentTimeEmitterContext.Provider>
);
