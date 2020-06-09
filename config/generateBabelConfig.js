/**
 * This file needs to Vanilla JavaScript that can be executed in the current Node environment as Babel cannot know what
 * transformations it would need to apply before reading this file
 */

/**
 * @typedef {import("@babel/core").TransformOptions} TransformOptions
 */

/**
 * Generate the Babel config
 * @param {"commonjs" | false} modules
 * @returns {TransformOptions}
 */
function generateBabelConfig(modules = "commonjs") {
  return {
    presets: [["@babel/preset-env", { modules }], "@babel/preset-typescript"],
    plugins: [
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-transform-runtime",
      "babel-plugin-lodash",
    ],
  };
}

module.exports = generateBabelConfig;
