import type { AnyFunction } from "@kablamo/kerosene";
import { renderHook } from "@testing-library/react";
import { identity, isBoolean } from "lodash";
import { act } from "react";
import {
  useLocalStorage,
  useSessionStorage,
  type CustomStorageEventInit,
} from "./storage";

const key = "key";
const otherKey = "otherKey";

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

  it("should return the defaultValue when localStorage does not contain valid JSON", () => {
    window[storageArea].setItem(key, "invalid");
    const { result } = renderHook(() => useStorage(key, false, isBoolean));
    expect(result.current[0]).toEqual(false);
  });

  it("should return the defaultValue during hydration", () => {
    window[storageArea].setItem(key, JSON.stringify(true));
    const onRender: jest.Mock<
      readonly [boolean, AnyFunction],
      [readonly [boolean, AnyFunction]]
    > = jest.fn().mockImplementation(identity);
    const { result } = renderHook(
      () => onRender(useStorage(key, false, isBoolean)),
      {
        hydrate: true,
      },
    );
    expect(onRender).toHaveBeenNthCalledWith(1, [false, expect.any(Function)]);
    expect(result.current[0]).toBe(true);
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
      expected: true,
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
      expected: true,
    },
    {
      name: "storage",
      event: new StorageEvent("storage", {
        key: otherKey,
        newValue: JSON.stringify(true),
        oldValue: null,
        storageArea: window[storageArea],
      }),
      expected: false,
    },
    {
      name: "@kablamo/kerosene-ui/storage",
      event: new CustomEvent<CustomStorageEventInit>(
        "@kablamo/kerosene-ui/storage",
        {
          cancelable: false,
          detail: {
            key: otherKey,
            newValue: JSON.stringify(true),
            oldValue: null,
            storageArea: window[storageArea],
            url: window.location.href,
          },
        },
      ),
      expected: false,
    },
  ])("should return $expected after '$name' event", ({ event, expected }) => {
    const { result } = renderHook(() => useStorage(key, false, isBoolean));
    expect(result.current[0]).toBe(false);

    const detail = event instanceof StorageEvent ? event : event.detail;
    act(() => {
      detail.storageArea!.setItem(detail.key!, JSON.stringify(true));
      window.dispatchEvent(event);
    });
    expect(result.current[0]).toBe(expected);
  });
});
