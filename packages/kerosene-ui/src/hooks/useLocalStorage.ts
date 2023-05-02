import { isEqual } from "lodash";
import * as React from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

const CUSTOM_STORAGE_EVENT_NAME = "@kablamo/kerosene-ui/storage";

export interface CustomStorageEventInit {
  readonly key: string | null;
  readonly newValue: string | null;
  readonly storageArea: Storage | null;
}

declare global {
  interface WindowEventMap {
    [CUSTOM_STORAGE_EVENT_NAME]: CustomEvent<CustomStorageEventInit>;
  }
}

const getServerSnapshot = () => null;

/**
 * Custom hook which allows reading/writing of `localStorage` in a manner similar to `React.useState`
 * @param key localStorage key
 * @param defaultValue Value used when `localStorage` contains an empty or invalid value
 * @param isT Type guard function which checks that the parsed value from `localStorage` is of type `T`
 */
export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  isT: (value: unknown) => value is T,
) {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const onCustomStorageEvent = (e: CustomEvent<CustomStorageEventInit>) => {
        if (
          e.detail.storageArea !== window.localStorage ||
          e.detail.key !== key
        )
          return;
        callback();
      };

      const onStorageEvent = (e: StorageEvent) => {
        if (e.storageArea !== window.localStorage || e.key !== key) return;
        callback();
      };

      window.addEventListener(CUSTOM_STORAGE_EVENT_NAME, onCustomStorageEvent);
      window.addEventListener("storage", onStorageEvent);
      return () => {
        window.removeEventListener(
          CUSTOM_STORAGE_EVENT_NAME,
          onCustomStorageEvent,
        );
        window.removeEventListener("storage", onStorageEvent);
      };
    },
    [key],
  );

  const getSnapshot = React.useCallback(() => {
    // In React 16 & 17, the `useSyncExternalStore` shim always uses `getSnapshot()`, even on the server
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return null;
    }

    return window.localStorage.getItem(key);
  }, [key]);

  const selector = React.useCallback(
    (stored: string | null) => {
      try {
        const parsed = stored ? (JSON.parse(stored) as unknown) : defaultValue;
        return isT(parsed) ? parsed : defaultValue;
      } catch (error) {
        return defaultValue;
      }
    },
    [defaultValue, isT],
  );

  const state = useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getServerSnapshot,
    selector,
    isEqual,
  );

  const setValue = React.useCallback(
    (value: React.SetStateAction<T>) => {
      const newValue = JSON.stringify(
        // @ts-expect-error
        typeof value === "function" ? value(selector(getSnapshot())) : value,
      );

      window.localStorage.setItem(key, newValue);
      window.dispatchEvent(
        new CustomEvent<CustomStorageEventInit>(CUSTOM_STORAGE_EVENT_NAME, {
          cancelable: false,
          detail: {
            key,
            newValue,
            storageArea: window.localStorage,
          },
        }),
      );
    },
    [getSnapshot, key, selector],
  );

  return [state, setValue] as const;
}
