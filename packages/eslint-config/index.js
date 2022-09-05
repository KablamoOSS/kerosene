module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:@kablamo/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@kablamo", "@typescript-eslint", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  rules: {
    // ESLint rules
    camelcase: "off",
    "max-classes-per-file": "off",
    "no-return-assign": ["error", "except-parens"],
    "no-underscore-dangle": "off",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true },
    ],

    // @typescript-eslint rules
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          // False positives for <T extends {}>
          "{}": false,
        },
      },
    ],
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
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: [
          ["builtin", "external"],
          "internal",
          "parent",
          "index",
          "sibling",
        ],
        "newlines-between": "never",
      },
    ],

    // eslint-plugin-react rules
    "react/function-component-definition": "off",
    "react/jsx-filename-extension": [
      "error",
      { allow: "always", extensions: [".tsx"] },
    ],
    "react/jsx-props-no-spreading": "off",
    // Allow Emotion css prop
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
    // Not required with TypeScript
    "react/require-default-props": "off",
    "react/prop-types": "off",
    "react/state-in-constructor": "off",
    "react/static-property-placement": ["error", "static public field"],

    // eslint-plugin-react-hooks rules
    "react-hooks/exhaustive-deps": [
      "error",
      {
        additionalHooks: "use.*Effect",
      },
    ],
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // ESLint rules that are broken in TS
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#please-read-this-issue-before-using-this-rule-1856
         */
        "no-use-before-define": "off",

        // ESLint rules that are checked by TypeScript
        "no-undef": "off",

        // eslint-plugin-import rules
        // False positives for TypeScript overloads
        "import/export": "off",

        // ESLint rules superseded by @typescript-eslint rules
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
      },
    },
    {
      files: ["*.d.ts"],
      rules: {
        // False positives across module declarations
        "import/duplicates": "off",
        // We can type devDependencies in *.d.ts
        "import/no-extraneous-dependencies": "off",
        // Ignore unresolved modules
        "import/no-unresolved": "off",

        "react/prefer-stateless-function": "off",

        "@typescript-eslint/ban-types": "off",
        // Declaration merging
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-namespace": "off",
      },
    },
  ],
};
