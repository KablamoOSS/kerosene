import isInViewport from "./isInViewport";

jest.mock("./getViewportDimensions", () => () => ({
  height: window.innerHeight,
  width: window.innerWidth,
}));

describe("#isInViewport", () => {
  [
    {
      message: "should return false when the element is above the viewport",
      clientRect: { top: -100, left: 0, right: window.innerWidth, bottom: -1 },
      isIn: false,
    },
    {
      message: "should return false when the element is below the viewport",
      clientRect: {
        top: window.innerHeight + 1,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight + 100,
      },
      isIn: false,
    },
    {
      message:
        "should return false when the element is to the left of the viewport",
      clientRect: {
        top: 0,
        left: -100,
        right: -1,
        bottom: window.innerHeight,
      },
      isIn: false,
    },
    {
      message:
        "should return false when the element is to the right of the viewport",
      clientRect: {
        top: 0,
        left: window.innerWidth + 1,
        right: window.innerWidth + 100,
        bottom: window.innerHeight,
      },
      isIn: false,
    },
    {
      message:
        "should return true when the element is at the edges of the viewport",
      clientRect: {
        top: 0,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      },
      isIn: true,
    },
    {
      message: "should return true when the element is wholly within viewport",
      clientRect: {
        top: 1,
        left: 1,
        right: window.innerWidth - 1,
        bottom: window.innerHeight - 1,
      },
      isIn: true,
    },
    {
      message:
        "should return true when the element extends outside the top left of the viewport",
      clientRect: {
        top: -1,
        left: -1,
        right: window.innerWidth,
        bottom: window.innerHeight,
      },
      isIn: true,
    },
    {
      message:
        "should return true when the element extends outside the top right of the viewport",
      clientRect: {
        top: -1,
        left: 0,
        right: window.innerWidth + 1,
        bottom: window.innerHeight,
      },
      isIn: true,
    },
    {
      message:
        "should return true when the element extends outside the bottom left of the viewport",
      clientRect: {
        top: 0,
        left: -1,
        right: window.innerWidth,
        bottom: window.innerHeight + 1,
      },
      isIn: true,
    },
    {
      message:
        "should return true when the element extends outside the bottom right of the viewport",
      clientRect: {
        top: 0,
        left: 0,
        right: window.innerWidth + 1,
        bottom: window.innerHeight + 1,
      },
      isIn: true,
    },
  ].forEach(({ message, clientRect, isIn }) => {
    it(message, () => {
      expect(
        isInViewport(({
          getBoundingClientRect: () => clientRect as ClientRect,
        } as Partial<HTMLElement>) as HTMLElement),
      ).toBe(isIn);
    });
  });
});
