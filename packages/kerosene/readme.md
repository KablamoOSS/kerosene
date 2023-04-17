# Kerosene

```
yarn add @kablamo/kerosene
```

It's like `lodash`, but it's ours.

## Available functions

Grouped by input data type

## Array

### `contains`

Returns `true` if all the values in `subset` are present in `superset`.

Otherwise, returns `false`

You can pass in an `iteratee` as the third argument, like in `lodash`.

### `product`

Returns the cartesian product of the source arrays.

### `remove`

Immutably removes all instances of `needle` from `haystack`.

Returns an empty array if `haystack` was empty.

Returns a new array that is referentially-not-equal to `haystack` even if `needle` is not in `haystack`

### `toggle`

Immutably adds the target item to the target array if it's not already in there.

Otherwise, immutably removes that item from the array.

## Datetime

### `SECOND`

1000 milliseconds

### `MINUTE`

60,000 milliseconds

### `HOUR`

3,600,000 milliseconds

### `DAY`

86,400,000 milliseconds

### `Month`

A 0-indexed enum for the months of the Gregorian Calendar

### `DayOfWeek`

A 0-indexed enum for the days of the week

### `getCalendarWeeks(month, startOfWeek)`

Returns a 4-, 5-, or 6-tuple of calendar weeks (7-tuples of Dates) for the `month` of the Date provided (according to the timezone of the environment).

### `isAfterDate(date, dateToCompare)`

Returns whether the day of `date` is after the day of `dateToCompare`.

### `isBeforeDate(date, dateToCompare)`

Returns whether the day of `date` is before the day of `dateToCompare`.

### `isSameOrAfterDate(date, dateToCompare)`

Returns whether the day of `date` is the same or after the day of `dateToCompare`.

### `isSameOrBeforeDate(date, dateToCompare)`

Returns whether the day of `date` is the same or before the day of `dateToCompare`.

## Fetch

### `isNetworkError(error)`

Returns whether or not `error` is a `fetch()` Network Error, accounting for browser differences.

Can be used to detect when the network is not available, although may be falsely triggered by CORS.

### `transform(response)`

Returns a Promise which transforms the body of a `fetch()` request according to content type header.

### `transformAndCheckStatus(response)`

Returns a Promise which transforms the body of a `fetch()` request according to content type header and rejects if the status is not 2xx.

If the status is in the 4XX range, it will throw a ClientError.

If the status is in the 5XX range, it will throw a ServerError.

All other non-2XX statuses are thrown as an HttpError.

## Function

### `timeout(delay, { signal? }?)`

Returns a `Promise` which resolves after the specified `delay` in milliseconds.

### `waitForEventLoopToDrain`

Returns a `Promise` which resolves after the current event loop drains.

## Iterable

### `isEquivalentSet(iterable1, iterable2)`

Returns whether `iterable1` is an equivalent set to `iterable2`.

## Math

### `floor`/`round`/`ceil`

Like the corresponding `Math` functions of the same name, but takes a second parameter `precision` which allows for more/less precise rounding.

For example, `round(1505, 10) === 1510` (round to the nearest 10).

### `clamp(min, value, max)`

Returns a `value` clamped between `min` and `max`.

Similar to the [CSS `clamp()` function](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp), this is resolved as `Math.max(min, Math.min(value, max))`.

### `divmod(dividend, divisor)`

Returns a 2-tuple containing `quotient` and `remainder` for the integer division of `dividend` by `divisor`.

Similar to the [Python `divmod` function](https://docs.python.org/3/library/functions.html#divmod).

### `isNegative`

Returns whether or not the provided `value` is negative, considering positive and negative zero separately

### `toDegrees`

Converts the value in `radians` to degrees.

### `toRadians`

Converts the value in `degrees` to radians.

### `toSignificantFigures(value, figures)`

Returns the provided `value` rounded to the number of significant `figures` provided.

## Promise

### `Deferred`

Deferred is a class that allows a Promise to be created in advance of the code that will `resolve`/`reject` it.

### `mapSeries(items, iteratee)`

Maps over `items` with a promise-returning `iteratee` in series.

## String

### `caseInsensitiveEquals`

Returns `true` if the two input strings are the same in all but casing.

Returns `false` otherwise.

### `elide`

Chop the input string off at `maxLength` if it is too long.

Defaults to adding a `...` if chopped, you can pass in any string to change
what the chopped string gets elided with.

The chopped string will not be longer than `maxLength`, even with the custom
elider-string.

### `getRandomString`

It's a good-enough random string for non-cryptographic purposes.

Always `32` characters long.

### `isOnlyWhitespace`

Returns `true` if the input string contains nothing other than whitespace.

This includes newlines.

Returns `false` otherwise

### `parseSearch(search)`

Deprecated in favour of `URLSearchParams`.

See https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams or https://nodejs.org/api/url.html#url_class_urlsearchparams for documentation.

### `removeLineBreaks`

Replaces all newlines in the input string with single spaces.

Returns the original string if no newlines were present.

### `replaceAll`

Replace all instances of `needle` in `haystack` with `newNeedle`

### `toTitleCase`

Converts a provided `input` to title case according to a list of `lowercaseWords` (default provided) which remain lowercase, unless they occur at the beginning or end.

#### `TITLE_CASE_LOWERCASE_WORDS`

The default list of `lowercaseWords` is exported as such.

## Types

### `AngleDegrees`

Marked type for an angle that should be specified in degrees

### `AngleRadians`

Marked type for an angle that should be specified in radians

### `AnyConstructor`

Alias for any constructor function

### `AnyFunction`

Alias for any function

### `BrandType<T, Brand>`

Brands type `T` with the provided `Brand`

### `MarkType<T, Brand>`

Marks type `T` with the provided `Brand`. Differs from `BrandType` in that the branding is optional.

### `OpaqueType<T, Brand>`

Brands type `T` as an opaque type (no runtime effect). To use as `T`, consumers must explicitly unwrap the value.

### `Underlying<T>`

For a branded type `T`, provides the underlying type

### `brandT<BrandType>(underlying)`

Returns the value `underlying` branded according to the type parameter

### `opaqueT<OpaqueType>(underlying)`

Returns the value `underlying` as the `OpaqueType` specified as the type parameter

### `underlyingT<Branding>(branded)`

Unwraps the `branded` type to return the underlying value

### `DeepMutable<T>`

Recursively traverses `T` to make all properties mutable

### `DeepNonNullable<T>`

Recursively traverses `T` to make all properties `Required` and `NonNullable`.

### `DeepPartial<T>`

Recursively traverses `T` to make all properties optional.

### `ElementType<TCollection>`

Infers the element type `T` from `T[]`, `Set<T>`, `Map<any, T>`, or `{ [key: string]: T }`.

### `Entries<T>`

Infers the union of all object entry tuples for type `T`.

### `DistributiveOmit<T, K>`

Like `Omit<T, K>`, but distributes across all members of a union.

### `DistributivePick<T, K>`

Like `Pick<T, K>`, but distributes across all members of a union.

### `InferrableTupleOf<T>`

Utility type which allows a generic constraint to be inferred as a tuple of T instead of an array of T

### `IsUnknownOrAny<T>`

Utility type which returns a boolean type for whether `T` is `unknown` or `any`

### `isRecord<T>`

Custom type predicate which checks whether a type is assignable to `Record<PropertyKey, unknown>`. If the type `T` of `obj` is known (not `unknown` or `any`), then the type will be narrowed.

### `KeysOfUnion<T>`

Like `keyof T`, but distributes across all members of unions to include all keys (including those not shared by all members).

### `KeysWhere<T, TValue>`

Creates a union of all keys of `T` where `T[key]` has type `TValue`.

### `MergedUnion<T>`

From a union type `T`, allows properties which are not shared by all members to be `undefined`.

### `Mutable<T>`

Removes the `readonly` modifier from all properties in `T`.

### `Overloads<T>`

From an overloaded function `T`, infer each overload as a tuple element.

### `OverloadedParameters<T>`

For an overloaded function `T`, infer the union of parameters for all overloads.

### `OverloadedReturnType<T>`

For an overloaded function `T`, infer the union of return types for all overloads.

### `OverloadedReturnTypeWhen<T, P>`

For an overloaded function `T`, infer the return type for the specific overload when parameters match `P`.

### `PickBy<T, TValue>`

Creates a new type from `T` including only keys where the value is assignable to type `TValue`.

### `RequireAtLeastOne<T>`

Creates a new type from `T` where at least one key is required and all others are optional.

### `RequiredKeys`

Utility type which acts like `keyof T`, but only includes required keys

### `RequireKeys<T, K>`

Creates a new type from `T` where keys `K` are marked as required
