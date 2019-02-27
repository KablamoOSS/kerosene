# Kerosene

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

### `removeLineBreaks`

Replaces all newlines in the input string with single spaces.

Returns the original string if no newlines were present.

### `replaceAll`

Replace all instances of `needle` in `haystack` with `newNeedle`
