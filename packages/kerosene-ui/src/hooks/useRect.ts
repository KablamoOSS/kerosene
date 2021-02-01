import { ElementType } from "@kablamo/kerosene";
import { isEqual, pick } from "lodash";
import * as React from "react";
import { SIDES } from "../utils/css";
import {
  ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
  REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
} from "../utils/listeners";
import useRafThrottle from "./useRafThrottle";

type Rect = { [side in ElementType<typeof SIDES>]: number };

type ScrollPosition = {
  scrollX: number;
  scrollY: number;
};

const DEFAULT_RECT: Rect = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

/**
 * Custom React Hook for reading bounding rect of a DOM Element
 * @param disable When set to `true`, updating the rect will be disabled
 * @param eventList Listens for specified event types and triggers update
 */
export default function useRect(
  disable = false,
  eventList: ReadonlyArray<keyof WindowEventMap> = [],
): [React.RefObject<Element>, Rect, ScrollPosition] {
  const ref = React.useRef<Element>(null);
  const [rect, setRect] = React.useState(DEFAULT_RECT);
  const [scroll, setScroll] = React.useState<ScrollPosition>({
    scrollX: 0,
    scrollY: 0,
  });
  const events = React.useMemo<ReadonlyArray<keyof WindowEventMap>>(
    () => ["scroll", ...eventList],
    [eventList],
  );

  const update = useRafThrottle(() => {
    const newRect = ref.current
      ? pick(ref.current.getBoundingClientRect(), SIDES)
      : DEFAULT_RECT;
    if (!isEqual(rect, newRect)) setRect(newRect);

    const newScroll = {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
    };
    if (!isEqual(scroll, newScroll)) setScroll(newScroll);
  });

  React.useLayoutEffect(() => {
    if (!disable) update();
  });

  React.useEffect(() => {
    if (!disable) {
      window.addEventListener("resize", update);
      events.forEach(event =>
        window.addEventListener(
          event,
          update,
          ADD_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
        ),
      );
    }

    return () => {
      window.removeEventListener("resize", update);
      events.forEach(event =>
        window.removeEventListener(
          event,
          update,
          REMOVE_EVENT_LISTENER_CAPTURE_PASSIVE_OPTIONS,
        ),
      );
    };
  }, [disable, update, events]);

  return [ref, rect, scroll];
}
