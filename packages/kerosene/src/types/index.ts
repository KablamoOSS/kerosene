/**
 * Make all nested properties of `T` `Required` and `NonNullable`
 */
export type DeepNonNullable<T> = {
  [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>>;
};

/**
 * Make all nested properties of `T` optional
 */
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Infers the element type `T` from `TCollection` where `TCollection` is one of:
 * - `readonly T[]`
 * - `Set<T>`
 * - `Map<any, T>`
 */
export type ElementType<
  TCollection
> = TCollection extends readonly (infer TArrayElement)[]
  ? TArrayElement
  : TCollection extends Set<infer TSetElement>
  ? TSetElement
  : TCollection extends Map<any, infer TMapElement>
  ? TMapElement
  : never;

/**
 * Creates a union of all keys of `T` where `T[key]` has type `TValue`
 */
export type KeysWhere<T extends object, TValue extends unknown> = {
  [Key in keyof T]: T extends { [key in Key]: TValue } ? Key : never;
}[keyof T];

/**
 * Make all properties of `T` mutable
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };
