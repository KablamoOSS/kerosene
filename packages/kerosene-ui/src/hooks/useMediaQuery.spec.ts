import type { Mutable } from "@kablamo/kerosene";
import { act, renderHook } from "@testing-library/react";
import { when } from "jest-when";
import useMediaQuery from "./useMediaQuery";

const mockMatchMedia: jest.Mock<
  jest.Mocked<MediaQueryList>,
  Parameters<Window["matchMedia"]>
> = jest.fn();

function getReturnValue<T>(result?: jest.MockResult<T>): T {
  if (result?.type !== "return") {
    throw new Error(
      `Expected result.type to be return, but was ${result?.type}`,
    );
  }
  return result.value;
}

const createMockMediaQueryList = ({
  matches,
  query,
}: {
  matches: boolean;
  query: string;
}): jest.Mocked<MediaQueryList> => ({
  addEventListener: jest.fn(),
  addListener: jest.fn(),
  dispatchEvent: jest.fn(),
  matches,
  media: query,
  onchange: null,
  removeListener: jest.fn(),
  removeEventListener: jest.fn(),
});
const update = (matches: boolean) =>
  act(() => {
    const list = getReturnValue(mockMatchMedia.mock.results[0]) as Mutable<
      jest.Mocked<MediaQueryList>
    >;
    list.matches = matches;
    list.addListener.mock.calls[0][0]!.call(list, {
      matches: list.matches,
      media: list.media,
    } as MediaQueryListEvent);
  });

const query = "(prefers-color-scheme: dark)";

describe("useMediaQuery", () => {
  let originalmatchMedia: typeof window.matchMedia;
  beforeEach(() => {
    originalmatchMedia = window.matchMedia;
    mockMatchMedia.mockImplementation((_query) =>
      createMockMediaQueryList({ matches: false, query: _query }),
    );
    window.matchMedia = mockMatchMedia;
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.matchMedia = originalmatchMedia;
  });

  it("should return false by default when window.matchMedia is unavailable", () => {
    // @ts-ignore
    delete window.matchMedia;
    const { result } = renderHook(() => useMediaQuery(query));
    expect(result.current).toBe(false);
  });

  it("should return true when window.matchMedia is unavailable and defaultMatches=true", () => {
    // @ts-ignore
    delete window.matchMedia;
    const { result } = renderHook(() =>
      useMediaQuery(query, { defaultMatches: true }),
    );
    expect(result.current).toBe(true);
  });

  it("should return true when the query matches", async () => {
    when(mockMatchMedia)
      .calledWith(query)
      .mockReturnValue(createMockMediaQueryList({ matches: true, query }));
    const { result } = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(true);
  });

  it("should respond to changes", async () => {
    const { result, unmount } = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(false);

    update(true);
    expect(result.current).toBe(true);

    update(false);
    expect(result.current).toBe(false);

    unmount();
    expect(
      getReturnValue(mockMatchMedia.mock.results[0]).removeListener,
    ).toBeCalledWith(
      getReturnValue(mockMatchMedia.mock.results[0]).addListener.mock
        .calls[0][0]!,
    );
  });
});
