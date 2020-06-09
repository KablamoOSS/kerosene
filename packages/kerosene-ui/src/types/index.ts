/**
 * Unwraps the decorated typings from a decorator-wrapped components to provide the original type of the underlying
 * component. Useful in unit testing when stubbing decorators with the identity function.
 */
export type UnwrapComponent<T> = T extends React.MemoExoticComponent<
  infer TMemoComponent
>
  ? { 0: UnwrapComponent<TMemoComponent> }[TMemoComponent extends any
      ? 0
      : never]
  : T extends React.LazyExoticComponent<infer TLazyComponent>
  ? { 0: UnwrapComponent<TLazyComponent> }[TLazyComponent extends any
      ? 0
      : never]
  : "WrappedComponent" extends keyof T
  ? {
      // @ts-ignore
      0: UnwrapComponent<T["WrappedComponent"]>;
      // @ts-ignore
    }[T["WrappedComponent"] extends any ? 0 : never]
  : T;
