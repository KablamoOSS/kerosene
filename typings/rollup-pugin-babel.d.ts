declare module "@rollup/plugin-babel" {
  import { TransformOptions } from "@babel/core";
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { Plugin } from "rollup";

  export default function babel(
    options?: TransformOptions & {
      extensions?: string[];
      babelHelpers?: "bundled" | "runtime" | "inline" | "external";
      skipPreflightCheck?: boolean;
    },
  ): Plugin;
}
