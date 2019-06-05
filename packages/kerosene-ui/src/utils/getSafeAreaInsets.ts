import { ElementType } from "@kablamo/kerosene";

let SAFE_AREA_INSET_TEST_ELEMENT: HTMLDivElement | null = null;

const DIRECTIONS = ["top", "left", "bottom", "right"] as const;

export type SafeAreaInsets = {
  [direction in ElementType<typeof DIRECTIONS>]: number
};

/**
 * Return the safe area insets
 */
export default function getSafeAreaInsets(): SafeAreaInsets {
  if (!SAFE_AREA_INSET_TEST_ELEMENT) {
    SAFE_AREA_INSET_TEST_ELEMENT = document.createElement("div");
    SAFE_AREA_INSET_TEST_ELEMENT.style.pointerEvents = "none";
    DIRECTIONS.forEach(direction => {
      SAFE_AREA_INSET_TEST_ELEMENT!.style[
        direction
      ] = `env(safe-area-inset-${direction}, 0px)`;
    });
    document.body.appendChild(SAFE_AREA_INSET_TEST_ELEMENT);
  }
  const computed = window.getComputedStyle(SAFE_AREA_INSET_TEST_ELEMENT);
  return DIRECTIONS.reduce(
    (acc, direction) => ({
      ...acc,
      [direction]:
        (computed[direction] && parseInt(computed[direction]!, 10)) || 0,
    }),
    ({} as Partial<SafeAreaInsets>) as SafeAreaInsets,
  );
}
