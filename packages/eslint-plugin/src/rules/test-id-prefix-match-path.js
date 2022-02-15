"use strict";

const path = require("path");

const getPrefixFromFilePath = (context) => {
  const filePath = path.relative(process.cwd(), context.getFilename());
  const { dir } = path.parse(filePath);

  return dir
    .split(path.sep)
    .filter((elem) => !["packages", "src"].includes(elem))
    .filter(Boolean)
    .join("-");
};

module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (node && node.callee && node.callee.name === "createTestIds") {
          if (node.arguments.length < 0) {
            return context.report({
              node,
              message: "missing arguments for createTestIds",
            });
          }

          const validPrefix = getPrefixFromFilePath(context);
          const testPrefix = node.arguments[0];

          if (testPrefix.value !== validPrefix) {
            context.report({
              node: node.arguments[0],
              message: "Test ID prefix name is invalid",
              fix(fixer) {
                return fixer.replaceTextRange(
                  node.arguments[0].range,
                  `"${validPrefix}"`,
                );
              },
            });
          }
        }
        return undefined;
      },
    };
  },
  meta: {
    type: "code",
    docs: {
      description: "ensure createTestId prefix matches path",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: "code",
    schema: [],
  },
};
