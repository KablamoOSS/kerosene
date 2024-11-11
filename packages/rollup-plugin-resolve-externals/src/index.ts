import { escapeRegExp } from "lodash";
import path from "path";
import type { ExternalOption, Plugin } from "rollup";

export interface ResolveExternalsPluginOptions {
  /**
   * List of external modules
   */
  externals: readonly string[];
  /**
   * `paths` used by `require.resolve(name, { paths })` to resolve dependencies
   */
  paths?: string[];
}

export default function resolveExternals({
  externals,
  paths = require.main?.paths,
}: ResolveExternalsPluginOptions): Plugin {
  const external = ((source) =>
    externals.includes(source) ||
    externals.some((mod) =>
      source.startsWith(`${mod}/`),
    )) satisfies ExternalOption;
  const deepExternalRegex = new RegExp(
    `^(${externals.map((e) => escapeRegExp(e)).join("|")})/(.+)$`,
  );

  return {
    name: "@kablamo/rollup-plugin-resolve-externals",

    resolveId(source) {
      // Ignore non-externals
      if (!external(source)) return null;

      // Match deep imports from a package
      const match = deepExternalRegex.exec(source);
      if (match) {
        const [, mod, importPath] = match;
        // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const pkgJson = require(`${mod}/package.json`) as Record<
          string,
          unknown
        >;

        // If package exports are not defined, we need to resolve the path so that CommonJS files
        // can be resolved properly from `.mjs` files
        if (!pkgJson.exports) {
          // Resolve the module to a path on disk
          const resolvedPath = require.resolve(`${mod}/${importPath}`, {
            paths,
          });
          // Rewrite to a relative path
          const rewritten = `${mod}/${path
            .relative(
              path.dirname(
                require.resolve(`${mod}/package.json`, {
                  paths,
                }),
              ),
              resolvedPath,
            )
            // Handle win32 path separators
            .split(path.sep)
            .join("/")}`;
          return {
            id: rewritten,
            external: true,
          };
        }
      }

      return {
        id: source,
        external: true,
      };
    },
  };
}
