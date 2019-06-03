import renameExtensions from "@betit/rollup-plugin-rename-extensions";
import path from "path";
import { ModuleFormat, RollupOptions, OutputOptions } from "rollup";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import packageJson from "./package.json";
import generateBabelConfig from "../../config/generateBabelConfig";

const input = path.join(__dirname, "src", "index.ts");

const output = (file: string, format: ModuleFormat): OutputOptions => ({
  dir: path.dirname(file),
  format,
  indent: false,
  sourcemap: true,
});

const external = [
  "querystring",
  ...[packageJson.dependencies, packageJson.peerDependencies].flatMap(Object.keys),
];

const extensions = [".js", ".ts"];

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
    extensions,
  }),
  renameExtensions({
    mappings: {
      ".ts": ".js",
    },
  }),
];

export default [
  {
    input,
    output: [output(packageJson.main, "commonjs"), output(packageJson.module, "esm")],
    external,
    plugins,
    preserveModules: true,
  },
] as RollupOptions[];
