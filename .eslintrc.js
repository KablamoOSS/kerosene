const path = require("path");

/** @satisfies {import("eslint").Linter.Config} */
module.exports = {
  extends: path.join(__dirname, "packages", "eslint-config", "index.js"),
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        // ban `import { method } from "lodash";` but permit `import type { Thing } from "lodash";`
        selector:
          'ImportDeclaration[importKind!="type"][source.value="lodash"]',
        message:
          'Prefer `import method from "lodash/method";` over `import { method } from "lodash";`',
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
