/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */

/**
 * Alias for any constructor function
 */
export type AnyConstructor = new (...args: any) => any;

/**
 * Alias for any function
 */
export type AnyFunction = (...args: any) => any;

/**
 * This symbol does not exist at runtime, but rather only exists to support branding of types
 */
declare const BRAND: unique symbol;

/**
 * This symbol does not exist at runtime, but rather only exists to support branding of types
 */
declare const UNDERLYING: unique symbol;

type Branding<T, Brand> = {
  [BRAND]?: Brand;
  [UNDERLYING]?: { T: T };
};

/**
 * Brands type `T` with the provided `Brand`
 */
export type BrandType<T, Brand> = T & Required<Branding<T, Brand>>;

/**
 * Marks type `T` with the provided `Brand`. Differs from `BrandType` in that the branding is optional.
 */
export type MarkType<T, Brand> = T & Branding<T, Brand>;

/**
 * Brands type `T` as an opaque type (no runtime effect). To use as `T`, consumers must explicitly unwrap the value.
 */
export type OpaqueType<T, Brand> = Required<Branding<T, Brand>>;

/**
 * For a branded type `T`, provides the underlying type
 */
export type Underlying<T extends Branding<unknown, unknown>> = NonNullable<
  T[typeof UNDERLYING]
>["T"];

/**
 * Returns the value `underlying` branded according to the type parameter
 * @param underlying
 * @example
 * ```ts
 * const radians = brandT<BrandType<number, "AngleRadians">>(Math.PI);
 * ```
 */
export function brandT<T extends BrandType<unknown, unknown>>(
  underlying: Underlying<T>,
): T {
  return underlying as T;
}

/**
 * Returns the value `underlying` as the `OpaqueType` specified as the type parameter
 * @param underlying
 * @example
 * ```tsx
 * const filename = opaqueT<OpaqueType<string, "S3Filename">>(response.filename);
 * // $ExpectError filename may not be passed directly to <img /> tag and should be included as part of a signed URL
 * const img = <img src={filename} />;
 * ```
 */
export function opaqueT<T extends OpaqueType<unknown, unknown>>(
  underlying: Underlying<T>,
): T {
  return underlying as T;
}

/**
 * Unwraps the `branded` type to return the underlying value
 * @param branded
 * @example
 * ```ts
 * async function getSignedUrl(filename: OpaqueType<string, "S3Filename">): string {
 *   return getSignedUrl(s3Client, new GetObjectCommand({ Bucket, Key: underlyingT(filename) }));
 * }
 * ```
 */
export function underlyingT<T extends Branding<unknown, unknown>>(
  branded: T,
): Underlying<T> {
  return branded as Underlying<T>;
}

/**
 * Recursively traverses `T` to make all properties mutable
 */
export type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };

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
export type ElementType<TCollection> =
  TCollection extends readonly (infer TArrayElement)[]
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
 * Like `Omit<T, K>`, but distributes across all members of a union.
 *
 * e.g.
 * ```typescript
 * type Base = Omit<{ base: string } & ({ a: string } | { b: string; }) & { common: string }, "common">;
 * // equivalent to (note that a and b are missing)
 * type Base = { base: string };
 *
 * type AorB = DistributiveOmit<{ base: string } & ({ base: string; a: string } | { base: string; b: string; }) & { common: string }, "common">;
 * // equivalent to (note that a and b are present)
 * type AorB = { base: string } & ({ a: string } | { b: string });
 * ```
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

/**
 * Like `Pick<T, K>`, but distributes across all memebrs of a union.
 */
export type DistributivePick<T, K extends KeysOfUnion<T>> = T extends any
  ? Pick<T, K>
  : never;

/**
 * Utility type which allows a generic constraint to be inferred as a tuple of T instead of an array of T
 *
 * @example
 * ```ts
 * type Box<T> = { prop: T };
 *
 * function badBoxesIdentity<TBoxes extends readonly Box<unknown>[]>(boxes: TBoxes): TBoxes;
 * // $ExpectType readonly Box<string | number>[]
 * const badBoxes = badBoxesIdentity([{ prop: "a" }, { prop: 1 }]);
 *
 * function boxesIdentity<TBoxes extends InferrableTupleOf<Box<unknown>>(boxes: TBoxes): TBoxes;
 * // $ExpectType readonly [Box<string>, Box<number>]
 * const boxes = boxesIdentity([{ prop: "a" }, { prop: 1 }]);
 * ```
 * @see https://github.com/microsoft/TypeScript/issues/6310#issuecomment-168365222
 */
export type InferrableTupleOf<T> = readonly [never] | ReadonlyArray<T>;

/**
 * Utility type which returns a boolean type for whether `T` is `unknown` or `any`
 */
export type IsUnknownOrAny<T> = T extends unknown
  ? unknown extends T
    ? true
    : false
  : false;

/**
 * Custom type predicate which checks whether a type is assignable to `Record<PropertyKey, unknown>`. If the type `T` of
 * `obj` is known (not `unknown` or `any`), then the type will be narrowed.
 * @param obj
 */
export function isRecord<T = unknown>(
  obj: T,
): obj is IsUnknownOrAny<T> extends true
  ? Record<PropertyKey, unknown> extends T
    ? Record<PropertyKey, unknown>
    : Extract<T, object>
  : Extract<T, object> {
  return typeof obj === "object" && obj !== null;
}

/**
 * Like `keyof T`, but distributes across all members of unions to include all keys (including those
 * not shared by all members)
 */
export type KeysOfUnion<T> = T extends any ? keyof T : never;

/**
 * Creates a union of all keys of `T` where `T[key]` has type `TValue`
 */
export type KeysWhere<T extends object, TValue> = {
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
    } & T1
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
 * From an overloaded function `T`, infer each overload as a tuple element
 */
export type Overloads<T> = T extends {
  (...args: infer P1): infer R1;
  (...args: infer P2): infer R2;
  (...args: infer P3): infer R3;
  (...args: infer P4): infer R4;
  (...args: infer P5): infer R5;
  (...args: infer P6): infer R6;
}
  ? [
      (...args: P1) => R1,
      (...args: P2) => R2,
      (...args: P3) => R3,
      (...args: P4) => R4,
      (...args: P5) => R5,
      (...args: P6) => R6,
    ]
  : T extends {
      (...args: infer P1): infer R1;
      (...args: infer P2): infer R2;
      (...args: infer P3): infer R3;
      (...args: infer P4): infer R4;
      (...args: infer P5): infer R5;
    }
  ? [
      (...args: P1) => R1,
      (...args: P2) => R2,
      (...args: P3) => R3,
      (...args: P4) => R4,
      (...args: P5) => R5,
    ]
  : T extends {
      (...args: infer P1): infer R1;
      (...args: infer P2): infer R2;
      (...args: infer P3): infer R3;
      (...args: infer P4): infer R4;
    }
  ? [
      (...args: P1) => R1,
      (...args: P2) => R2,
      (...args: P3) => R3,
      (...args: P4) => R4,
    ]
  : T extends {
      (...args: infer P1): infer R1;
      (...args: infer P2): infer R2;
      (...args: infer P3): infer R3;
    }
  ? [(...args: P1) => R1, (...args: P2) => R2, (...args: P3) => R3]
  : T extends {
      (...args: infer P1): infer R1;
      (...args: infer P2): infer R2;
    }
  ? [(...args: P1) => R1, (...args: P2) => R2]
  : T extends (...args: infer P1) => infer R1
  ? [(...args: P1) => R1]
  : never;

/**
 * For an overloaded function `T`, infer the union of parameters for all overloads
 */
export type OverloadedParameters<T> = Parameters<Overloads<T>[number]>;

/**
 * For an overloaded function `T`, infer the union of return types for all overloads
 */
export type OverloadedReturnType<T> = ReturnType<Overloads<T>[number]>;

/**
 * For an overloaded function `T`, infer the return type for the specific overload when parameters match `P`
 */
export type OverloadedReturnTypeWhen<T, P extends unknown[]> = T extends (
  ...args: P
) => infer R
  ? R
  : never;

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

/**
 * Utility type which acts like `keyof T`, but only includes required keys
 */
export type RequiredKeys<T extends object> = T extends unknown
  ? {
      [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
    }[keyof T]
  : never;

/**
 * Creates a new type from `T` where keys `K` are marked as required
 */
export type RequireKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
