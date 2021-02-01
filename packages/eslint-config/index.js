module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
    "plugin:prettier/recommended",
    "plugin:@kablamo/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
  },
  rules: {
    // ESLint rules
    "arrow-parens": ["error", "always"],
    camelcase: "off",
    "max-classes-per-file": "off",
    "sort-imports": "error",

    // @typescript-eslint rules
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": ["error", {
      extendDefaults: true,
      types: {
        // False positives for <T extends {}>
        "{}": false
      },
    }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",

    // eslint-plugin-import rules
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-cycle": "off",

    // eslint-plugin-react rules
    "react/jsx-filename-extension": ["error", { allow: "always", extensions: [".tsx"] }],
    "react/jsx-props-no-spreading": "off",
    "react/static-property-placement": ["error", "static public field"],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // ESLint rules that are broken in TS
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#please-read-this-issue-before-using-this-rule-1856
         */
        "no-shadow": "off",

        // ESLint rules that are checked by TypeScript
        "no-undef": "off",

        // ESLint rules superseded by @typescript-eslint rules
        "@typescript-eslint/no-shadow": "error",
        "no-use-before-define": "off",
      },
    },
  ],
};
