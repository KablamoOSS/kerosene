import babel from "@rollup/plugin-babel";
import path from "path";
import {
  ModuleFormat,
  RollupOptions,
  OutputOptions,
  ExternalOption,
} from "rollup";
import resolve from "rollup-plugin-node-resolve";
// eslint-disable-next-line import/no-relative-packages
import generateBabelConfig from "../../config/generateBabelConfig";
import packageJson from "./package.json";

const input = path.join(__dirname, "src", "index.ts");

const output = (file: string, format: ModuleFormat): OutputOptions => ({
  dir: path.dirname(file),
  format,
  indent: false,
  sourcemap: true,
});

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
      output(packageJson.main, "commonjs"),
      output(packageJson.module, "esm"),
    ],
    external,
    plugins,
    preserveModules: true,
  },
] as RollupOptions[];
