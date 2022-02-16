const path = require("path");

module.exports = {
  extends: path.join(__dirname, "packages", "eslint-config", "index.js"),
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          ".eslintrc.js",
          "babel-register.js",
          "babel.config.js",
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
      files: ["*.js"],
      rules: {
        "global-require": "off",
        strict: "off",
      },
    },
  ],
};
