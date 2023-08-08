// @ts-check

/** @satisfies {import("eslint").Linter.Config} */
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
      "@typescript-eslint/parser": [
        ".ts",
        ".tsx",
        ".cts",
        ".ctsx",
        ".mts",
        ".mtsx",
      ],
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".cts", ".ctsx", ".mts", ".mtsx"],
      },
      typescript: true,
    },
  },
  rules: {
    // ESLint rules
    camelcase: "off",
    "max-classes-per-file": "off",
    // The motivations behind this rule are outdated, and we find this is a useful pattern in a number of circumstances
    "no-await-in-loop": "off",
    // Same as eslint-config-airbnb, but removes the restrcition on ForOfStatement now that there is wide browser support
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
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
    "react/jsx-key": "error",
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
      files: ["*.ts", "*.tsx", "*.cts", ".ctsx", "*.mts", "*.mtsx"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parserOptions: {
        project: true,
      },
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

        // @typesript-eslint type-aware rules
        // Too opinionated for now, revisit later
        "@typescript-eslint/no-unsafe-argument": "off",
        // Too opinionated for now, revisit later
        "@typescript-eslint/no-unsafe-assignment": "off",
        // Too opinionated for now, revisit later
        "@typescript-eslint/no-unsafe-member-access": "off",
        // Too opinionated for now, revisit later
        "@typescript-eslint/no-unsafe-return": "off",
        // We often use async functions over return Promise.resolve()
        "@typescript-eslint/require-await": "off",
        // Too opinionated for now, revisit later
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        // Causes false positives with Jest mocks
        // @see https://typescript-eslint.io/rules/unbound-method/#when-not-to-use-it
        "@typescript-eslint/unbound-method": "off",
      },
    },
    {
      files: ["*.d.ts", "*.d.cts", "*.d.mts"],
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
