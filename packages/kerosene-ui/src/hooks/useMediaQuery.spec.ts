import { act, renderHook } from "@testing-library/react";
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
  matches: () => boolean;
  query: string;
}): jest.Mocked<MediaQueryList> => ({
  addEventListener: jest.fn(),
  addListener: jest.fn(),
  dispatchEvent: jest.fn(),
  get matches() {
    return matches();
  },
  media: query,
  onchange: null,
  removeListener: jest.fn(),
  removeEventListener: jest.fn(),
});

const query = "(prefers-color-scheme: dark)";
let matches: boolean;

const update = (_matches: boolean) =>
  act(() => {
    matches = _matches;
    mockMatchMedia.mock.calls
      .flatMap(([_query], index) =>
        query === _query
          ? [getReturnValue(mockMatchMedia.mock.results[index])]
          : [],
      )
      .forEach((list) =>
        list.addListener.mock.calls.forEach(([listener]) => {
          listener!.call(list, {
            matches: list.matches,
            media: list.media,
          } as MediaQueryListEvent);
        }),
      );
  });

describe("useMediaQuery", () => {
  let originalmatchMedia: typeof window.matchMedia;
  beforeEach(() => {
    originalmatchMedia = window.matchMedia;
    matches = false;
    mockMatchMedia.mockImplementation((_query) =>
      createMockMediaQueryList({ matches: () => matches, query: _query }),
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
    matches = true;
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
    mockMatchMedia.mock.results.forEach((r) => {
      const list = getReturnValue(r);
      list.addListener.mock.calls.forEach(([callback]) => {
        expect(list.removeListener).toHaveBeenCalledWith(callback);
      });
    });
  });
});
