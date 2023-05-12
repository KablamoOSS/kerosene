import { act, renderHook } from "@testing-library/react";
import { isBoolean } from "lodash";
import {
  useLocalStorage,
  useSessionStorage,
  type CustomStorageEventInit,
} from "./storage";

const key = "key";

describe.each([
  {
    name: "useLocalStorage",
    useStorage: useLocalStorage,
    storageArea: "localStorage",
  },
  {
    name: "useSessionStorage",
    useStorage: useSessionStorage,
    storageArea: "sessionStorage",
  },
] as const)("$name", ({ useStorage, storageArea }) => {
  let _storage: Storage;
  beforeEach(() => {
    _storage = window[storageArea];
  });

  afterEach(() => {
    window[storageArea] = _storage;
    window[storageArea].clear();
  });

  it("should return the defaultValue for server render", () => {
    delete window[storageArea];
    const { result } = renderHook(() => useStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(false);
  });

  it("should return the defaultValue", () => {
    const { result } = renderHook(() => useStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(false);
  });

  it("should return a setValue function that updates the storageArea", () => {
    const { result } = renderHook(() => useStorage(key, false, isBoolean));

    // Plain update
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toEqual(true);
    expect(window[storageArea].getItem(key)).toEqual(JSON.stringify(true));

    // Updater function
    act(() => {
      result.current[1]((previous) => !previous);
    });
    expect(result.current[0]).toEqual(false);
    expect(window[storageArea].getItem(key)).toEqual(JSON.stringify(false));
  });

  it("should return the value from localStorage", () => {
    window[storageArea].setItem(key, JSON.stringify(true));
    const { result } = renderHook(() => useStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(true);
  });

  it("should return the defaultValue when localStorage does not match the type", () => {
    window[storageArea].setItem(key, JSON.stringify("true"));
    const { result } = renderHook(() => useStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(false);
  });

  it.each([
    {
      name: "storage",
      event: new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(true),
        oldValue: null,
        storageArea: window[storageArea],
      }),
    },
    {
      name: "@kablamo/kerosene-ui/storage",
      event: new CustomEvent<CustomStorageEventInit>(
        "@kablamo/kerosene-ui/storage",
        {
          cancelable: false,
          detail: {
            key,
            newValue: JSON.stringify(true),
            oldValue: null,
            storageArea: window[storageArea],
            url: window.location.href,
          },
        },
      ),
    },
  ])("should update on '$name' event", ({ event }) => {
    const { result } = renderHook(() => useStorage(key, false, isBoolean));
    expect(result.current[0]).toBe(false);
    act(() => {
      window[storageArea].setItem(key, JSON.stringify(true));
      window.dispatchEvent(event);
    });
    expect(result.current[0]).toBe(true);
  });
});
