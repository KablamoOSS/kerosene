import { Rule } from "eslint";
import ruleTester from "../test/rule-tester";
import rule from "./test-id-consistent-naming";

const happyPath = "const element = () => <div data-testid={testIds.button} />";

ruleTester.run("test-id-consistent-naming", rule as Rule.RuleModule, {
  valid: [
    {
      code: "const element = () => <div data-testid={testIds.button} />",
    },
    {
      code: "const element = () => <div data-test-id={testIds.button} />",
      options: ["data-test-id"],
    },
    {
      code: "const element = () => <div data-testid={testIds.button} />",
      options: ["data-testid"],
    },
  ],

  invalid: [
    {
      code: "const element = () => <div testId={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-id-test={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-testId={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-testID={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      output: happyPath,
    },
    {
      code: "const element = () => <div dataTestId={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      output: happyPath,
    },
    {
      code: "const element = () => <div datatestid={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-test-id={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-id-test={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-testId={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-testID={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: happyPath,
    },
    {
      code: "const element = () => <div dataTestId={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: happyPath,
    },
    {
      code: "const element = () => <div datatestid={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-test-id={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: happyPath,
    },
    {
      code: "const element = () => <div data-test-id={testIds.button} />",
      errors: [{ message: "Test ID attribute should be named data-testid" }],
      options: ["data-testid"],
      output: "const element = () => <div data-testid={testIds.button} />",
    },
  ],
});
