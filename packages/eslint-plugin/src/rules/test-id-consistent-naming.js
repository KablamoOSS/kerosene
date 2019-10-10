"use strict";

const enforceKey = (context, validName) => jsxAttribute => {
  context.report({
    node: jsxAttribute,
    message: `Test ID attribute should be named ${validName}.`,
    fix(fixer) {
      return fixer.replaceTextRange(jsxAttribute.name.range, validName);
    },
  });
};

module.exports = {
  create(context) {
    return {
      'JSXAttribute[name.name = "testId"]': enforceKey(context, "data-test-id"),
      'JSXAttribute[name.name = "data-id-test"]': enforceKey(
        context,
        "data-test-id",
      ),
      'JSXAttribute[name.name = "data-testId"]': enforceKey(
        context,
        "data-test-id",
      ),
      'JSXAttribute[name.name = "data-testID"]': enforceKey(
        context,
        "data-test-id",
      ),
      'JSXAttribute[name.name = "dataTestId"]': enforceKey(
        context,
        "data-test-id",
      ),
      'JSXAttribute[name.name = "datatestid"]': enforceKey(
        context,
        "data-test-id",
      ),
      'JSXAttribute[name.name = "data-testid"]': enforceKey(
        context,
        "data-test-id",
      ),
    };
  },
  meta: {
    type: "code",
    docs: {
      description: "ensure a single consistent naming of data-test-id",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: "code",
    schema: [],
  },
};
