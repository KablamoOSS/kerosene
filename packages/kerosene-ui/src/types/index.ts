/**
 * Used internally by `UnwrapComponent<T>` to unwrap a single layer decorator-wrapped component
 * @private
 */
export type _UnwrapComponent<T> = T extends React.MemoExoticComponent<
  infer TMemoComponent
>
  ? TMemoComponent
  : T extends React.LazyExoticComponent<infer TLazyComponent>
  ? TLazyComponent
  : "WrappedComponent" extends keyof T
  // @ts-ignore
  ? T["WrappedComponent"]
  : T;

/**
 * Unwraps the decorated typings from a decorator-wrapped components to provide the original type of the underlying
 * component. Useful in unit testing when stubbing decorators with the identity function.
 *
 * Note: This will unwrap up to 8 layers of decorators as although TypeScript supports recursive types, it does not
 * allow recursive type arguments. If more levels are required, you may use the `_UnwrapComponent<T>` type to unwrap
 * a single layer at a time.
 */
export type UnwrapComponent<T> = _UnwrapComponent<
  _UnwrapComponent<
    _UnwrapComponent<
      _UnwrapComponent<
        _UnwrapComponent<
          _UnwrapComponent<_UnwrapComponent<_UnwrapComponent<T>>>
        >
      >
    >
  >
>;
