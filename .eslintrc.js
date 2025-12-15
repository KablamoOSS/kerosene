const path = require("path");

/** @satisfies {import("eslint").Linter.Config} */
module.exports = {
  extends: path.join(__dirname, "packages", "eslint-config", "index.js"),
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["lodash/*"],
            message: 'Please use the default import from "lodash" instead.',
          },
        ],
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          ".eslintrc.js",
          "testSetup.ts",
          "config/**/*",
          "typings/**/*",
          "vitest.config.ts",
          "**/es/**/*",
          "**/lib/**/*",
          "**/*.spec.*",
          "**/*.test.*",
          "**/tsdown.config.*",
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["*.js", "*.cjs"],
      rules: {
        "global-require": "off",
        strict: "off",
      },
    },
  ],
};
