import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  // esm type exports aren't set correctly
  // exports: true,
  format: ["cjs", "esm"],
  sourcemap: true,
});
