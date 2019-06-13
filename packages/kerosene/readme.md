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

## Fetch

### `isNetworkError(error)`

Returns whether or not `error` is a `fetch()` Network Error, accounting for browser differences.

Can be used to detect when the network is not available, although may be falsely triggered by CORS.

### `transform(response)`

Returns a Promise which transforms the body of a `fetch()` request according to content type header.

### `transformAndCheckStatus(response)`

Returns a Promise which transforms the body of a `fetch()` request according to content type header and rejects if the status is not 2xx.

## Function

### `timeout(delay)`

Returns a `Promise` which resolves after the specified `delay` in milliseconds.

### `waitForEventLoopToDrain`

Returns a `Promise` which resolves after the current event loop drains.

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

## Moment

### `getCalendarWeeks(month, startOfWeek)`

Returns a 4-, 5-, or 6-tuple of calendar weeks (7-tuples of moments) for the `month` of the moment provided.

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

Uses `querystring.parse` to parse `Location#search`. When search is an empty string or contains no parameters, this will return an empty object.

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

### `DeepNonNullable<T>`

Recursively traverses `T` to make all properties `Required` and `NonNullable`.

### `DeepPartial<T>`

Recursively traverses `T` to make all properties optional.

### `ElementType<TCollection>`

Infers the element type `T` from `T[]`, `Set<T>` or `Map<any, T>`.

### `Mutable<T>`

Removes the `readonly` modifier from all properties in `T`.
