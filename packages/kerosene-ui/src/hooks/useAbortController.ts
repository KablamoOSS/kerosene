import * as React from "react";

/**
 * Custom hook which manages a series of `AbortController`s, aborting the previous when requesting
 * the `next`, and aborting the final controller on unmount
 *
 * e.g.
 *
 * ```typescript
 * const { next } = useAbortController();
 * const onClick = useCallback(() => {
 *   const controller = next();
 *   // all but the latest fetch is aborted, and is also aborted if the component unmounts
 *   fetch(url, { signal: controller.signal }).then(transformAndCheckStatus).then((data) => {
 *     if (controller.signal.aborted) return;
 *     setState(data);
 *   });
 * }, [next]);
 * ```
 */
export default function useAbortController() {
  const ref = React.useRef<AbortController>(undefined);

  React.useEffect(
    () => () => {
      ref.current?.abort();
    },
    [],
  );

  const next = React.useCallback(() => {
    ref.current?.abort();
    ref.current = new AbortController();
    return ref.current;
  }, []);

  return {
    next,
    ref,
  };
}
