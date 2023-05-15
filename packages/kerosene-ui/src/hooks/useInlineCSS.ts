import type { KeysWhere } from "@kablamo/kerosene";
import { noop } from "lodash";
import * as React from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

export type CSSStylePropertyKey =
  | KeysWhere<Omit<CSSStyleDeclaration, number>, string>
  | `--${string}`;

export interface UseInlineCSSOptions<PropertyKey extends CSSStylePropertyKey> {
  property: PropertyKey;
  value?:
    | (PropertyKey extends keyof React.CSSProperties
        ? Extract<React.CSSProperties[PropertyKey], string>
        : string)
    | null;
  priority?: "important" | "";
}

function applyProperty<PropertyKey extends CSSStylePropertyKey>(
  el: HTMLElement | SVGElement | null,
  { property, value, priority }: UseInlineCSSOptions<PropertyKey>,
): () => void {
  el?.style.setProperty(property, value ?? null, priority);

  return () => {
    el?.style.removeProperty(property);
  };
}

// Silence warnings about potential hydration mismatch when using `useInsertionEffect` on the server as we're only using
// `useInsertionEffect` when applying inline styles above the hydration root.
const useInsertionEffect =
  typeof window === "undefined" ? React.useEffect : React.useInsertionEffect;

/**
 * Custom hook which applies a CSS `property` `value` with `priority` to the element provided in `refOrSelector`
 * @param options.property
 * @param options.value
 * @param options.priority
 * @param refOrSelector
 */
export default function useInlineCSS<
  PropertyKey extends CSSStylePropertyKey,
  T extends HTMLElement | SVGElement,
>(
  { property, value, priority }: UseInlineCSSOptions<PropertyKey>,
  refOrSelector: React.RefObject<T> | "html" | "body" = "html",
) {
  // If we're using a selector, we can apply the styles immediately, before rendering
  useInsertionEffect(() => {
    if (typeof refOrSelector !== "string") return noop;

    return applyProperty(document.querySelector(refOrSelector), {
      property,
      value,
      priority,
    });
  }, [priority, property, refOrSelector, value]);

  // If we're using a ref, we apply the styles synchronously, after rendering
  useIsomorphicLayoutEffect(() => {
    if (typeof refOrSelector === "string") return noop;

    return applyProperty(refOrSelector.current, { property, value, priority });
  }, [priority, property, refOrSelector, value]);
}
