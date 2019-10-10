module.exports.rules = {
  "test-id-prefix-match-path": require("./rules/test-id-prefix-match-path"),
  "test-id-consistent-naming": require("./rules/test-id-consistent-naming")
};

module.exports.configs = {
  recommended: {
    rules: {
      "@kablamo/eslint-plugin/test-id-prefix-match-path": 2,
      "@kablamo/eslint-plugin/test-id-consistent-naming": 2
    }
  }
};
