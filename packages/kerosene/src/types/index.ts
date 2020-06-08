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
 * - `{ [key: string]: T }`
 */
export type ElementType<
  TCollection
> = TCollection extends readonly (infer TArrayElement)[]
  ? TArrayElement
  : TCollection extends Set<infer TSetElement>
  ? TSetElement
  : TCollection extends Map<any, infer TMapElement>
  ? TMapElement
  : TCollection extends { readonly [key: string]: infer TObjectElement }
  ? TObjectElement
  : never;

/**
 * Infers the union of all object entry tuples for type `T`
 */
export type Entries<T> = { [P in keyof T]: [P, T[P]] }[keyof T];

/**
 * Like `keyof T`, but distributes across all members of unions to include all keys (including those
 * not shared by all members)
 */
export type KeysOfUnion<T> = T extends any ? keyof T : never;

/**
 * Creates a union of all keys of `T` where `T[key]` has type `TValue`
 */
export type KeysWhere<T extends object, TValue extends unknown> = {
  [Key in keyof T]: T extends { [key in Key]: TValue } ? Key : never;
}[keyof T];

/**
 * This utility type is just used to provide two different references to the same type so that one
 * instance may be distributed and the other left intact. Here, `T1` is used to distribute across
 * each member of the union, whereas `T2` is used as the complete union. Both are the same type.
 * @private
 */
type __MergedUnion__<T1 extends object, T2 extends object> = T1 extends any
  ? {
      [K in Exclude<KeysOfUnion<T2>, keyof T1>]?: undefined;
    } &
      T1
  : never;

/**
 * From a union type `T`, allows properties which are not shared by all members to be `undefined`
 *
 * e.g.
 * ```typescript
 * type FooBar = MergedUnion<{ common: string; foo: string } | { common: string; bar: string }>;
 * // equivalent to
 * type FooBar = { common: string; foo: string; bar?: undefined } | { common: string; foo?: undefined; bar: string };
 * ```
 */
export type MergedUnion<T extends object> = __MergedUnion__<T, T>;

/**
 * Make all properties of `T` mutable
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Creates a new type from `T` including only keys where the value is assignable to type `TValue`
 */
export type PickBy<T extends object, TValue> = {
  [K in KeysWhere<T, TValue>]: T[K];
};

/**
 * Creates a new type from `T` where at least one key is required and all others are optional
 */
export type RequireAtLeastOne<T> = {
  [K in keyof T]: Partial<Pick<T, Exclude<keyof T, K>>> & Required<Pick<T, K>>;
}[keyof T];
