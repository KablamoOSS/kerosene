import { RuleTester } from "eslint";

export default new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    plugins: ["react"],
  },
});
