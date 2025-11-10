import isEqual from "lodash/isEqual";
import * as React from "react";

/**
 * Creates a hook that will call the callback when the `code` is entered
 *
 * Note: If the `code` only contains basic keys it can be supplied as a string. For keys that do not have a single
 * character representation, `KeyboardEvent#key` values may be specified in an array
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 *
 * @param code
 * @param callback
 */
export default function useKonamiCode(
  code: string | readonly string[],
  callback: () => void,
) {
  const pressed = React.useRef([] as string[]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      pressed.current.push(e.key);
      while (pressed.current.length > code.length) pressed.current.shift();
      if (isEqual(pressed.current, [...code])) callback();
    };

    window.addEventListener("keydown", onKeyDown, false);

    return () => window.removeEventListener("keydown", onKeyDown, false);
  }, [code, callback]);
}
