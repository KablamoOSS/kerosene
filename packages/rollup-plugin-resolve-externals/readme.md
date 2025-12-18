# @kablamo/rollup-plugin-resolve-externals

```
npm install --save-dev @kablamo/rollup-plugin-resolve-externals
```

This rollup plugin forces subpath imports from packages without [package `exports`](https://nodejs.org/api/packages.html#subpath-exports) to resolve to a filename. This allows such imports to occur in `.mjs` files which would otherwise complain.
