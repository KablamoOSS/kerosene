import { timeout } from "@kablamo/kerosene";
import { noop } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import waitForRepaint from "../utils/waitForRepaint";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import useMediaQuery from "./useMediaQuery";

export interface UseCollapsableReturn {
  ref: React.RefObject<HTMLElement | null>;
  /**
   * Until `HTMLElement.inert` has widespread support, this flag can be used to determine whether to render child elements
   * of the collapsable container so that they are excluded from the accessibility tree and are not interactable via
   * keyboard.
   */
  render: boolean;
  /**
   * Styles to be applied to the collapsable element including:
   * - `maxHeight`
   * - `overflow`
   * - `transitionDuration`
   * - `transitionProperty`
   * - `transitionTimingFunction`
   */
  style: React.CSSProperties;
}

/**
 * Custom hook which manages height transitions on the element that `ref` is applied to using `maxHeight`
 * @param open
 * @param options
 */
export default function useCollapsable(
  open: boolean,
  {
    immediate = false,
    transitionDuration: animatedTransitionDuration = 250,
    transitionTimingFunction = "ease-in-out",
  }: {
    immediate?: boolean;
    transitionDuration?: number;
    transitionTimingFunction?: React.CSSProperties["transitionTimingFunction"];
  } = {},
): UseCollapsableReturn {
  const [render, setRender] = React.useState(open);
  const [transitionDuration, setTransitionDuration] = React.useState(
    animatedTransitionDuration,
  );
  const [maxHeight, setMaxHeight] = React.useState<number | "none">(
    open ? "none" : 0,
  );

  const ref = React.useRef<HTMLElement>(null);

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const immediateRef = React.useRef(immediate || prefersReducedMotion);
  const transitionDurationRef = React.useRef(animatedTransitionDuration);
  useIsomorphicLayoutEffect(() => {
    immediateRef.current = immediate || prefersReducedMotion;
    transitionDurationRef.current = animatedTransitionDuration;
  }, [animatedTransitionDuration, immediate, prefersReducedMotion]);

  const hasRun = React.useRef(false);
  useIsomorphicLayoutEffect(() => {
    const controller = new AbortController();

    if (immediateRef.current || !hasRun.current) {
      hasRun.current = true;
      if (open) {
        setRender(true);
        setMaxHeight("none");
      } else {
        setRender(false);
        setMaxHeight(0);
      }
    } else if (open) {
      setTransitionDuration(0);

      waitForRepaint({ signal: controller.signal })
        .then(() =>
          // NOTE: `ReactDOM.unstable_batchedUpdates(callback)` is required here to ensure async updates are flushed at
          // the same time as part of the same update.
          // From React 18, this is no longer required as updates are batched automatically and
          // `ReactDOM.flushSync(callback)` is opt-in
          ReactDOM.unstable_batchedUpdates(() => {
            setTransitionDuration(transitionDurationRef.current);
            setMaxHeight(0);
            setRender(true);
          }),
        )
        .then(() => waitForRepaint({ signal: controller.signal }))
        .then(() => {
          setMaxHeight(ref.current!.scrollHeight);
        })
        .then(() =>
          timeout(transitionDurationRef.current, { signal: controller.signal }),
        )
        .then(() => {
          setMaxHeight("none");
        })
        .catch(noop);
    } else {
      setMaxHeight(ref.current!.scrollHeight);
      setTransitionDuration(transitionDurationRef.current);

      waitForRepaint({ signal: controller.signal })
        .then(() => {
          setMaxHeight(0);
        })
        .then(() =>
          timeout(transitionDurationRef.current, { signal: controller.signal }),
        )
        .then(() => {
          setRender(false);
        })
        .catch(noop);
    }

    return controller.abort.bind(controller);
  }, [open]);

  const style = React.useMemo(
    () => ({
      maxHeight,
      overflow: "hidden",
      transitionProperty: "max-height",
      transitionDuration: `${
        immediate || prefersReducedMotion ? 0 : transitionDuration
      }ms`,
      transitionTimingFunction,
    }),
    [
      immediate,
      maxHeight,
      prefersReducedMotion,
      transitionDuration,
      transitionTimingFunction,
    ],
  );

  return { ref, render, style };
}
