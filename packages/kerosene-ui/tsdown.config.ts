import resolveExternals from "@kablamo/rollup-plugin-resolve-externals";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import { defineConfig } from "tsdown";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  dts: true,
  entry: ["src/index.ts", "src/react-query.ts"],
  // esm type exports aren't set correctly
  // exports: true,
  // include everything, as resolveExternals() will handle this instead
  noExternal: /.*?/,
  format: ["cjs", "esm"],
  plugins: [
    optimizeLodashImports({ parseOptions: { lang: "ts" } }),
    resolveExternals({
      externals: [
        packageJson.dependencies,
        packageJson.peerDependencies,
      ].flatMap(Object.keys),
    }),
  ],
  sourcemap: true,
});
