import { RuleTester } from "eslint";

export default new RuleTester({
  parser: require.resolve("@babel/eslint-parser"),
  parserOptions: {
    parserOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ["react"],
    settings: {
      react: {
        pragma: "React",
        version: "16.0.0",
      },
    },
  },
});
