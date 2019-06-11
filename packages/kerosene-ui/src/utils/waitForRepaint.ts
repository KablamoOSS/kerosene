/**
 * Returns a cancellable promise which resolves after a layout reflow/repaint
 */
export default function waitForRepaint() {
  let handle: number | null = null;
  let rejectPromise: ((reason?: unknown) => void) | null = null;
  const cancel = () => {
    handle && window.cancelAnimationFrame(handle);
    rejectPromise && rejectPromise(new Error("waitForRepaint was cancelled"));
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
