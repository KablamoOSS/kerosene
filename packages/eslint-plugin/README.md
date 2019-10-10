# Kablamo eslint plugin

`yarn add -D @kablamo/eslint-plugin`

Add the following to your `.eslintrc.js`.

```js
module.exports = {
  plugins: ["@kablamo"],
  extends: ["plugin:@kablamo/recommended"],
};
```

## Rules

### `test-id-prefix-match-path`

This rule fixes the first argument of `createTestIds(prefix, [ ...ids])` to be a prefix derived from the files
current directory. This ensures consistent unique prefixes per component.

You can still suffix variables to the end of your test id for example `data-test-id={`${testId.myId}-${uuid}}`.

### `test-id-consistent-naming`

This rule ensures common misspellings always get fixed to the kebab-case `data-test-id`.

## Configurations

This plugin contains a reccomended elsint ruleset to enable the included rules.

### Developing

Run `yarn test` from the root of the project.
