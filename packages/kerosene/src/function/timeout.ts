/**
 * Resolves after the specified delay
 * @param delay Delay in milliseconds
 * @param options.signal
 */
export default function timeout(
  delay: number,
  { signal }: { signal?: AbortSignal } = {},
) {
  let handle: number | null = null;
  let rejectPromise: ((reason?: unknown) => void) | null = null;

  const onAbort = () => {
    handle && clearTimeout(handle);
    rejectPromise?.(new Error("Aborted"));
    rejectPromise = null;
  };
  signal?.addEventListener("abort", onAbort);

  const cancel = () => {
    handle && clearTimeout(handle);
    rejectPromise?.(new Error("Cancelled"));
    rejectPromise = null;
    signal?.removeEventListener("abort", onAbort);
  };

  return Object.assign(
    new Promise<void>((resolve, reject) => {
      rejectPromise = reject;
      handle = setTimeout(resolve, delay);
    }),
    { cancel },
  );
}
