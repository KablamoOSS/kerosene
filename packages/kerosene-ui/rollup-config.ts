import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import path from "path";
import type { RollupOptions, ExternalOption } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import packageJson from "./package.json";

const input = [
  path.join(__dirname, "src", "index.ts"),
  path.join(__dirname, "src", "react-query.ts"),
];

const outputDir = path.dirname(packageJson.main);

const externals = [
  packageJson.dependencies,
  packageJson.peerDependencies,
].flatMap(Object.keys);

const external: ExternalOption = (source) =>
  externals.includes(source) ||
  externals.some((mod) => source.startsWith(`${mod}/`));

const plugins = [esbuild(), optimizeLodashImports()];

export default [
  {
    input,
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
        preserveModules: true,
        sourcemap: true,
      },
    ],
    external,
    plugins,
  },
] satisfies RollupOptions[];
