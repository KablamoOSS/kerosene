import * as React from "react";

export default function usePageVisibility(
  useState?: true,
): [boolean, React.RefObject<boolean>];

export default function usePageVisibility(
  useState: false,
): React.RefObject<boolean>;

/**
 * Custom React Hook which listens to the page visibility API and provides a ref
 * @param [useState] Whether or not to use state (default) or ref for the current visibility
 * @returns If `useState` is `true` (or not set) a 2-tuple containing a boolean and a ref, otherwise just a ref
 */
export default function usePageVisibility(
  useState = true,
): [boolean, React.RefObject<boolean>] | React.RefObject<boolean> {
  const [visible, setVisible] = React.useState(!document.hidden);
  const visibility = React.useRef(!document.hidden);

  const onVisibilityChange = React.useCallback(() => {
    // Fallback to `document.hidden=false` if the API is not present
    const { hidden = false } = document;

    // Always update the ref
    visibility.current = !hidden;

    // Only set the state when `useState` is `true`
    if (useState) {
      setVisible(!hidden);
    }
  }, [useState]);

  // Sync visibility when the component renders
  React.useEffect(onVisibilityChange, []);

  // Listen to visibilitychange events and update accordingly
  React.useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange, false);

    return () =>
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
        false,
      );
  }, []);

  return useState
    ? [visible, visibility as React.RefObject<boolean>]
    : (visibility as React.RefObject<boolean>);
}
