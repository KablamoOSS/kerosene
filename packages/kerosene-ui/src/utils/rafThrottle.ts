/**
 * Throttles the provided `callback` with `window.requestAnimationFrame`
 * @param callback
 */
export default function rafThrottle<T extends any[]>(
  callback: (...args: T) => void,
) {
  let id: number | null = null;

  const deferred = (...args: T) => () => {
    id = null;
    callback(...args);
  };

  return Object.assign(
    (...args: T) => {
      if (!id) {
        id = window.requestAnimationFrame(deferred(...args));
      }
    },
    {
      cancel: () => {
        if (id) {
          window.cancelAnimationFrame(id);
          id = null;
        }
      },
    },
  );
}
