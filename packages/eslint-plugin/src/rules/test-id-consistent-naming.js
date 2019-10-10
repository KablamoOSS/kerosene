"use strict";

const enforceKey = (context, validName) => jsxAttribute => {
  context.report({
    node: jsxAttribute,
    message: `Test ID attribute should be named ${validName}`,
    fix(fixer) {
      return fixer.replaceTextRange(jsxAttribute.name.range, validName);
    },
  });
};

module.exports = {
  create(context) {
    const pragma = context.options[0] || "data-test-id";

    const match = {
      'JSXAttribute[name.name = "testId"]': enforceKey(context, pragma),
      'JSXAttribute[name.name = "data-id-test"]': enforceKey(context, pragma),
      'JSXAttribute[name.name = "data-idtest"]': enforceKey(context, pragma),
      'JSXAttribute[name.name = "dataTestId"]': enforceKey(context, pragma),
      'JSXAttribute[name.name = "datatestid"]': enforceKey(context, pragma),
    };

    const pragmaMatch =
      pragma === "data-test-id"
        ? {
            'JSXAttribute[name.name = "data-testid"]': enforceKey(
              context,
              pragma,
            ),
            'JSXAttribute[name.name = "data-testId"]': enforceKey(
              context,
              pragma,
            ),
            'JSXAttribute[name.name = "data-testID"]': enforceKey(
              context,
              pragma,
            ),
          }
        : {
            'JSXAttribute[name.name = "data-test-id"]': enforceKey(
              context,
              pragma,
            ),
          };

    return {
      ...match,
      ...pragmaMatch,
    };
  },
  meta: {
    type: "code",
    docs: {
      description: "ensure a single consistent naming of data test id",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        enum: ["data-test-id", "data-testid"],
      },
    ],
  },
};
