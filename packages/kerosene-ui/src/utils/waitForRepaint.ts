/**
 * Returns a cancellable promise which resolves after a layout reflow/repaint
 * @param options.signal
 */
export default function waitForRepaint({
  signal,
}: { signal?: AbortSignal } = {}) {
  let handle: number | null = null;
  let rejectPromise: ((reason?: unknown) => void) | null = null;

  const onAbort = () => {
    if (handle) window.cancelAnimationFrame(handle);
    rejectPromise?.(new Error("Aborted"));
    rejectPromise = null;
  };
  signal?.addEventListener("abort", onAbort);

  const cancel = () => {
    if (handle) window.cancelAnimationFrame(handle);
    rejectPromise?.(new Error("waitForRepaint was cancelled"));
    rejectPromise = null;
    signal?.removeEventListener("abort", onAbort);
  };

  return Object.assign(
    new Promise<void>((resolve, reject) => {
      rejectPromise = reject;

      handle = window.requestAnimationFrame(() => {
        handle = window.requestAnimationFrame(() => {
          handle = null;
          rejectPromise = null;
          resolve();
        });
      });
    }),
    { cancel },
  );
}
