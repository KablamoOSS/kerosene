import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["packages/*/(.dist|dist|es|lib)", "**/*.(spec|test).*"],
      reporter: "lcov",
    },
    // Libraries like `@testing-library/react` rely on globals for automatic cleanup
    globals: true,
    setupFiles: ["./testSetup.ts"],
  },
});
