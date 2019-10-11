// This test almost works
// eslint isn't being pulled in and configure correctly to run it yet

"use strict";

import rule from "./test-id-prefix-match-path";
import ruleTester from "../test/rule-tester";

const testCode = (prefix: string) => `
const testIds = createTestIds("${prefix}", [
    "wrapper",
    "title",
    "buttonLeft",
    "buttonRight"
  ]);
`;

ruleTester.run("test-id-prefix-match-path", rule, {
  valid: [
    {
      code: testCode("components-atoms-button"),
      filename: "src/components/atoms/button/index.tsx",
    },
    {
      code: testCode("components-atoms-title"),
      filename: "src/components/atoms/title/index.tsx",
    },
    {
      code: testCode("components-atoms-input"),
      filename: "src/components/atoms/input/index.tsx",
    },
    {
      code: testCode("components-button"),
      filename: "src/components/button/index.tsx",
    },
  ],

  invalid: [
    {
      code: testCode("prefix"),
      filename: "src/components/atoms/button/index.tsx",
      errors: [{ message: "Test ID prefix name is invalid" }],
    },
    {
      code: testCode("prefix"),
      filename: "src/components/atoms/title/index.tsx",
      errors: [{ message: "Test ID prefix name is invalid" }],
    },
    {
      code: testCode("prefix"),
      filename: "src/components/atoms/input/index.tsx",
      errors: [{ message: "Test ID prefix name is invalid" }],
    },
    {
      code: testCode("prefix"),
      filename: "src/components/button/index.tsx",
      errors: [{ message: "Test ID prefix name is invalid" }],
    },
  ],
});
