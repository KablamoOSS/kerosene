declare module "@rollup/plugin-babel" {
  import type { TransformOptions } from "@babel/core";
  // eslint-disable-next-line import/no-extraneous-dependencies
  import type { Plugin } from "rollup";

  export default function babel(
    options?: TransformOptions & {
      extensions?: string[];
      babelHelpers?: "bundled" | "runtime" | "inline" | "external";
      skipPreflightCheck?: boolean;
    },
  ): Plugin;
}
