module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@kablamo"],
  extends: [
    "plugin:@kablamo/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: "16.0",
    },
  },
};
