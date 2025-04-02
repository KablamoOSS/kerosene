const path = require("path");

/** @satisfies {import("eslint").Linter.Config} */
module.exports = {
  extends: path.join(__dirname, "packages", "eslint-config", "index.js"),
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          ".eslintrc.js",
          "testSetup.ts",
          "config/**/*",
          "typings/**/*",
          "**/es/**/*",
          "**/lib/**/*",
          "**/*.spec.*",
          "**/*.test.*",
          "**/rollup.config.*",
          "**/rollup-config.*",
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
