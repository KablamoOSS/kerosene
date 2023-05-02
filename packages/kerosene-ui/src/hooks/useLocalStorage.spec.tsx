import { act, renderHook } from "@testing-library/react";
import { isBoolean } from "lodash";
import useLocalStorage, {
  type CustomStorageEventInit,
} from "./useLocalStorage";

const key = "key";

describe("useLocalStorage", () => {
  let _localStorage: Storage;
  beforeEach(() => {
    _localStorage = window.localStorage;
  });

  afterEach(() => {
    window.localStorage = _localStorage;
    window.localStorage.clear();
  });

  it("should return the defaultValue for server render", () => {
    // @ts-expect-error
    delete window.localStorage;
    const { result } = renderHook(() => useLocalStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(false);
  });

  it("should return the defaultValue", () => {
    const { result } = renderHook(() => useLocalStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(false);
  });

  it("should return a setValue function that updates localStorage", () => {
    const { result } = renderHook(() => useLocalStorage(key, false, isBoolean));

    // Plain update
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toEqual(true);
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(true));

    // Updater function
    act(() => {
      result.current[1]((previous) => !previous);
    });
    expect(result.current[0]).toEqual(false);
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(false));
  });

  it("should return the value from localStorage", () => {
    localStorage.setItem(key, JSON.stringify(true));
    const { result } = renderHook(() => useLocalStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(true);
  });

  it("should return the defaultValue when localStorage does not match the type", () => {
    localStorage.setItem(key, JSON.stringify("true"));
    const { result } = renderHook(() => useLocalStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(false);
  });

  it.each([
    {
      name: "storage",
      event: new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(true),
        oldValue: null,
        storageArea: window.localStorage,
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
            storageArea: window.localStorage,
          },
        },
      ),
    },
  ])("should update on '$name' event", ({ event }) => {
    const { result } = renderHook(() => useLocalStorage(key, false, isBoolean));
    expect(result.current[0]).toBe(false);
    act(() => {
      localStorage.setItem(key, JSON.stringify(true));
      window.dispatchEvent(event);
    });
    expect(result.current[0]).toBe(true);
  });
});
