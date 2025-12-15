import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  // esm type exports aren't set correctly
  // exports: true,
  format: ["cjs", "esm"],
  plugins: [optimizeLodashImports({ parseOptions: { lang: "ts" } })],
  sourcemap: true,
});
