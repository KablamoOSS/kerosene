# Kerosene

A monorepo-style collection of useful bits and pieces.

_Use Kerosene to make your project *lit*_ ⛽💥🔥. Made by [Kablamo](https://kablamo.com.au?ref=docs)

[![Coverage Status](https://coveralls.io/repos/github/KablamoOSS/kerosene/badge.svg?branch=master)](https://coveralls.io/github/KablamoOSS/kerosene?branch=master)
[![Code Count](https://sloc.xyz/github/KablamoOSS/kerosene/?category=code)](https://github.com/KablamoOSS/kerosene/)
[![Comment Count](https://sloc.xyz/github/KablamoOSS/kerosene/?category=comments)](https://github.com/KablamoOSS/kerosene/)
[![COCOMO Estimate](https://sloc.xyz/github/KablamoOSS/kerosene/?category=cocomo)](https://github.com/KablamoOSS/kerosene/)

## Modules Index

### Feature Flags

```
yarn add @kablamo/kerosene-feature-flags
```

A simple assertion style feature flag for use in CI/CD deployment pipelines, especially well suited to monorepos and Trunk Based Development.

[View Kerosene Feature Flags on npm](https://www.npmjs.com/package/@kablamo/kerosene-feature-flags)

### Kerosene

```
yarn add @kablamo/kerosene
```

Like lodash, but it's ours. Basically some pure functions that do stuff useful for anybody.

[View Kerosene on npm](https://www.npmjs.com/package/@kablamo/kerosene)

### Kerosene-UI

```
yarn add @kablamo/kerosene-ui
```

React components and other UI-related code to help with some common tasks.

[View Kerosene-UI on npm](https://www.npmjs.com/package/@kablamo/kerosene-ui)

### Kerosene-Test

```
yarn add --dev @kablamo/kerosene-test
```

Some useful testing tools for unit testing and stubbing.

[View Kerosene-Test on npm](https://www.npmjs.com/package/@kablamo/kerosene-test)

### Kerosene-Styles

```
yarn add @kablamo/kerosene-styles
```

Some useful stylings for UI-related code.

[View Kerosene-Styles on npm](https://www.npmjs.com/package/@kablamo/kerosene-styles)

## FAQ

### How do I create a new package?

Copy an existing one and change what you need.

Manual intervention is required the first time you want to publish to npm.

### How do I run the tests?

From a terminal, run:

```bash
cd kerosene
yarn test
```
