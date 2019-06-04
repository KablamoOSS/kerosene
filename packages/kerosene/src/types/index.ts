export type DeepNonNullable<T> = {
  [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>>
};

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type ElementType<
  TCollection
> = TCollection extends readonly (infer TArrayElement)[]
  ? TArrayElement
  : TCollection extends Set<infer TSetElement>
  ? TSetElement
  : TCollection extends Map<any, infer TMapElement>
  ? TMapElement
  : never;

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };
