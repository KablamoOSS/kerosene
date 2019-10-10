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

    const attributes = [
      "data-test-id",
      "testId",
      "data-id-test",
      "data-testId",
      "data-testID",
      "dataTestId",
      "datatestid",
      "data-testid",
      "testid",
    ];

    return attributes
      .filter(name => name !== pragma)
      .reduce(
        (acc, name) => ({
          ...acc,
          [`JSXAttribute[name.name = "${name}"]`]: enforceKey(context, pragma),
        }),
        {},
      );
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
