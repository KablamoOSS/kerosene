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

    resolveId(source, importer) {
      // Ignore non-externals
      if (!external(source)) return null;

      // Ignore during TypeScript declaration emit
      if (importer?.endsWith(".d.ts")) return null;

      // Match deep imports from a package
      const match = deepExternalRegex.exec(source);
      if (match) {
        const [, mod, importPath] = match;

        const pkgJsonLocation = require.resolve(`${mod}/package.json`, {
          paths,
        });
        // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-require-imports
        const pkgJson = require(pkgJsonLocation) as Record<string, unknown>;

        // If package exports are not defined, we need to resolve the path so that CommonJS files
        // can be resolved properly from `.mjs` files
        if (!pkgJson.exports) {
          try {
            // Resolve the module to a path on disk
            const resolvedPath = require.resolve(`${mod}/${importPath}`, {
              paths,
            });
            // Rewrite to a relative path
            const rewritten = `${mod}/${path
              .relative(path.dirname(pkgJsonLocation), resolvedPath)
              // Handle win32 path separators
              .split(path.sep)
              .join("/")}`;
            return {
              id: rewritten,
              external: true,
            };
          } catch (err) {
            // If a module can't be resolved, leave its path unchanged. Otherwise, re-throw the error.
            if (
              !err ||
              typeof err !== "object" ||
              !("code" in err) ||
              err.code !== "MODULE_NOT_FOUND"
            ) {
              throw err;
            }
          }
        }
      }

      return {
        id: source,
        external: true,
      };
    },
  };
}
