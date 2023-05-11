import babel from "@rollup/plugin-babel";
import path from "path";
import type { RollupOptions, ExternalOption } from "rollup";
import resolve from "rollup-plugin-node-resolve";
// eslint-disable-next-line import/no-relative-packages
import generateBabelConfig from "../../config/generateBabelConfig";
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

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const plugins = [
  resolve({
    customResolveOptions: {
      moduleDirectory: __dirname,
    },
    extensions,
  }),
  babel({
    ...generateBabelConfig(false),
    babelrc: false,
    configFile: false,
    extensions,
    babelHelpers: "runtime",
  }),
];

export default [
  {
    input,
    output: [
      {
        entryFileNames: "[name].cjs",
        dir: outputDir,
        format: "commonjs",
        preserveModules: true,
        sourcemap: true,
      },
      {
        entryFileNames: "[name].mjs",
        dir: outputDir,
        format: "esm",
        preserveModules: true,
        sourcemap: true,
      },
    ],
    external,
    plugins,
  },
] satisfies RollupOptions[];
