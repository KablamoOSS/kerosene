/**
 * Unwraps the decorated typings from a decorator-wrapped components to provide the original type of the underlying
 * component. Useful in unit testing when stubbing decorators with the identity function.
 */
export type UnwrapComponent<T> = T extends React.MemoExoticComponent<
  infer TMemoComponent
>
  ? UnwrapComponent<TMemoComponent>
  : T extends React.LazyExoticComponent<infer TLazyComponent>
    ? UnwrapComponent<TLazyComponent>
    : "WrappedComponent" extends keyof T
      ? UnwrapComponent<T["WrappedComponent"]>
      : T;
