import type { ElementType } from "@kablamo/kerosene";
import { SIDES } from "./css";

let SAFE_AREA_INSET_TEST_ELEMENT: HTMLDivElement | null = null;

export type SafeAreaInsets = { [side in ElementType<typeof SIDES>]: number };

/**
 * Return the safe area insets
 */
export default function getSafeAreaInsets(): SafeAreaInsets {
  if (!SAFE_AREA_INSET_TEST_ELEMENT) {
    SAFE_AREA_INSET_TEST_ELEMENT = document.createElement("div");
    SAFE_AREA_INSET_TEST_ELEMENT.style.pointerEvents = "none";
    SIDES.forEach((side) => {
      SAFE_AREA_INSET_TEST_ELEMENT!.style[
        side
      ] = `env(safe-area-inset-${side}, 0px)`;
    });
    document.body.appendChild(SAFE_AREA_INSET_TEST_ELEMENT);
  }
  const computed = window.getComputedStyle(SAFE_AREA_INSET_TEST_ELEMENT);
  return SIDES.reduce(
    (acc, side) => ({
      ...acc,
      [side]: (computed[side] && parseInt(computed[side]!, 10)) || 0,
    }),
    {} as Partial<SafeAreaInsets> as SafeAreaInsets,
  );
}
