import resolveExternals from "@kablamo/rollup-plugin-resolve-externals";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import path from "path";
import type { RollupOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import packageJson from "./package.json";

const input = [
  path.join(__dirname, "src", "index.ts"),
  path.join(__dirname, "src", "react-query.ts"),
];

const outputDir = path.dirname(packageJson.main);

const plugins = [
  resolveExternals({
    externals: [packageJson.dependencies, packageJson.peerDependencies].flatMap(
      Object.keys,
    ),
  }),
  esbuild(),
  optimizeLodashImports(),
];

export default [
  {
    input,
    makeAbsoluteExternalsRelative: true,
    output: [
      {
        entryFileNames: "[name].cjs",
        dir: outputDir,
        format: "commonjs",
        interop: "auto",
        preserveModules: true,
        sourcemap: true,
      },
      {
        entryFileNames: "[name].mjs",
        dir: outputDir,
        format: "es",
        interop: "auto",
        preserveModules: true,
        sourcemap: true,
      },
    ],
    plugins,
  },
] satisfies RollupOptions[];
