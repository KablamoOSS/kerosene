import renameExtensions from "@betit/rollup-plugin-rename-extensions";
import path from "path";
import {
  ModuleFormat,
  RollupOptions,
  OutputOptions,
  ExternalOption,
} from "rollup";
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

const externals = [
  packageJson.dependencies,
  packageJson.peerDependencies,
].flatMap(Object.keys);

const external: ExternalOption = source =>
  externals.includes(source) ||
  externals.some(mod => source.startsWith(`${mod}/`));

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
    extensions,
  }),
  renameExtensions({
    mappings: {
      ".jsx": ".js",
      ".ts": ".js",
      ".tsx": ".js",
    },
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
