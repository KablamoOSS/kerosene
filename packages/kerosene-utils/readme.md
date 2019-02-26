# Kerosene Utils

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
