import * as React from "react";
import createStubComponent from "./createStubComponent";

/**
 * Creates a stub React Context for unit testing
 * @param displayName Display Name for the React Context
 * @param getter Getter function for `Context.Consumer`/`useContext(context)` value
 */
export default function createStubContext<T = unknown>(
  displayName: string,
  getter?: () => T,
): React.Context<T> & { readonly _currentValue: T } {
  return {
    Consumer: Object.assign(
      (props: React.ConsumerProps<T>) => props.children(getter!()),
      { displayName: `${displayName}.Consumer` },
    ) as unknown as React.Context<T>["Consumer"],
    Provider: createStubComponent(
      `${displayName}.Provider`,
    ) as unknown as React.Context<T>["Provider"],
    displayName,
    /**
     * `_currentValue` is used by the `useContext(context)` hook
     */
    get _currentValue() {
      return getter!();
    },
  };
}
