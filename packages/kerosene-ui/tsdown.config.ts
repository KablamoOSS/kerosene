import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  entry: ["src/index.ts", "src/react-query.ts"],
  // esm type exports aren't set correctly
  // exports: true,
  format: ["cjs", "esm"],
  sourcemap: true,
});
