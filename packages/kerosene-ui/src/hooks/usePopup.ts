import type { Mutable } from "@kablamo/kerosene";
import * as React from "react";
import {
  ADD_EVENT_LISTENER_PASSIVE_OPTIONS,
  REMOVE_EVENT_LISTENER_PASSIVE_OPTIONS,
} from "../utils/listeners";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import useRect from "./useRect";

/**
 * Custom Hook for a popup portal
 * @param zIndex
 * @param inside List of refs that are considered _inside_ the popup - useful for portals
 */
export default function usePopup(
  zIndex: string | null = null,
  inside: readonly React.RefObject<HTMLElement>[] = [],
) {
  const [open, setOpen] = React.useState(false);

  const [ref, rect, scroll] = useRect(!open);

  const portalEl = React.useRef<HTMLDivElement>(null);
  useIsomorphicLayoutEffect(() => {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      top: "0px",
      left: "0px",
      bottom: "0px",
      right: "0px",
      overflow: "visible",
      pointerEvents: "none",
      zIndex,
    });
    document.body.appendChild(el);
    (portalEl as Mutable<typeof portalEl>).current = el;

    return () => el.remove();
  }, [zIndex]);

  React.useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const { target } = e;
      const isInside =
        target instanceof Node &&
        [portalEl, ref, ...inside].some(
          (elRef) => !!elRef.current && elRef.current.contains(target),
        );

      if (!isInside && open) {
        setOpen(false);
      }
    };
    window.addEventListener(
      "click",
      onClickOutside,
      ADD_EVENT_LISTENER_PASSIVE_OPTIONS,
    );
    return () =>
      window.removeEventListener(
        "click",
        onClickOutside,
        REMOVE_EVENT_LISTENER_PASSIVE_OPTIONS,
      );
  });

  return {
    open,
    setOpen,
    ref,
    rect,
    portalEl,
    ...scroll,
  };
}
