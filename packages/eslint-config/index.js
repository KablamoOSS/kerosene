// @ts-check

const TS_EXTS = /** @type {const} */ ([".ts", ".cts", ".mts"]);
const JS_EXTS = /** @type {const} */ ([".js", ".cjs", ".mjs"]);
const TSX_EXTS = TS_EXTS.map((ext) => /** @type {const} */ (`${ext}x`));
const JSX_EXTS = JS_EXTS.map((ext) => /** @type {const} */ (`${ext}x`));
const STAR_TS_EXTS = TS_EXTS.map((ext) => /** @type {const} */ (`*${ext}`));
const STAR_TSX_EXTS = TSX_EXTS.map((ext) => /** @type {const} */ (`*${ext}`));
const STAR_JS_EXTS = JS_EXTS.map((ext) => /** @type {const} */ (`*${ext}`));
const STAR_JSX_EXTS = JSX_EXTS.map((ext) => /** @type {const} */ (`*${ext}`));
const STAR_DTS_EXTS = TS_EXTS.map((ext) => /** @type {const} */ (`.d${ext}`));

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
      "@typescript-eslint/parser": [...TS_EXTS, ...TSX_EXTS],
    },
    "import/resolver": {
      node: {
        extensions: [...TS_EXTS, ...TSX_EXTS],
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

    // ESLint rules superseded by @typescript-eslint rules
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",

    // @typescript-eslint rules
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
      { allow: "always", extensions: [...TSX_EXTS, ...JSX_EXTS] },
    ],
    "react/react-in-jsx-scope": "off",
    "react/jsx-key": "error",
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
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
      // CommonJS files only
      files: ["*.js", "*.cjs"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: [...STAR_TS_EXTS, ...STAR_TSX_EXTS],
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
        "no-throw-literal": "off",
        "@typescript-eslint/no-throw-literal": "error",
        // Allow void to be used to signify intentional ignoring of a Promise result
        "no-void": "off",
        "@typescript-eslint/no-meaningless-void-operator": "error",

        // Autofix for type-only imports
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
            disallowTypeAnnotations: false,
            fixStyle: "inline-type-imports",
          },
        ],
        "@typescript-eslint/no-import-type-side-effects": "error",

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
      files: STAR_DTS_EXTS,
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
    {
      files: [
        ...STAR_TS_EXTS,
        ...STAR_TSX_EXTS,
        ...STAR_JS_EXTS,
        ...STAR_JSX_EXTS,
      ],
      rules: {
        "@typescript-eslint/naming-convention": [
          "error",
          // camelCase is the default
          {
            selector: "default",
            format: ["camelCase"],
            leadingUnderscore: "allowSingleOrDouble",
            trailingUnderscore: "allowSingleOrDouble",
          },
          // imports should be camelCase or PascalCase
          {
            selector: "import",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allowSingleOrDouble",
            trailingUnderscore: "allowSingleOrDouble",
          },
          // variables can be camelCase, PascalCase, or UPPER_CASE
          {
            selector: "variable",
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
            leadingUnderscore: "allowSingleOrDouble",
            trailingUnderscore: "allowSingleOrDouble",
          },
          // destructuring variables from 3rd party sources which do not follow our naming conventions is okay
          { selector: "variable", format: null, modifiers: ["destructured"] },
          // functions should be camelCase or PascalCase
          {
            selector: "function",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allowSingleOrDouble",
            trailingUnderscore: "allowSingleOrDouble",
          },
          // types should be PascalCase
          {
            selector: "typeLike",
            format: ["PascalCase"],
            leadingUnderscore: "allowSingleOrDouble",
            trailingUnderscore: "allowSingleOrDouble",
          },
          // enum members should be UPPER_CASE
          {
            selector: "enumMember",
            format: ["UPPER_CASE"],
          },
          // 3rd party APIs do not always follow our naming conventions
          {
            selector: ["method", "parameter", "parameterProperty", "property"],
            format: null,
          },
          // ignore properties that require quotes
          {
            selector: [
              "classProperty",
              "objectLiteralProperty",
              "typeProperty",
              "classMethod",
              "objectLiteralMethod",
              "typeMethod",
              "accessor",
              "enumMember",
            ],
            format: null,
            modifiers: ["requiresQuotes"],
          },
        ],
      },
    },
  ],
};
