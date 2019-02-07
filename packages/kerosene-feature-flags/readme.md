# Kerosene Feature Flag

A simple assertion style feature flag for use in CI/CD deployment pipelines, especially well suited to monorepos and Trunk Based Development.

Feature Flags give you the ability to safely enable features in different environments, and for specific cohorts of people.

With a Kerosene Feature Flag you define a flag as an assertion of conditions, and their expected values.

```typescript
import { flag } from "@kablamo/kerosene-feature-flag";

const flags = {
    FEATURE123: flag(c => [
        c.condition("environment").must.not.any.of(["development", "staging"]),
        c.condition("group").must.not.be.exactly("beta"),
    ]),
    FEATURE42: flag(c => [
        c
            .condition("environment")
            .must.not.be.any.of(["development", "staging"]),
        c.condition("group").must.be.exactly("beta"),
    ]),
};

export { flags };
```

When you want to use the flags in your application, you import them, and execute them as a function, passing in an object with runtime information.

```typescript
import { flags } from "./features";

const runtime = {
    environment: "production",
    group: "users",
    browser: "Firefox",
};

if (flags.FEATURE123(runtime)) {
    console.log("New feature");
} else {
    console.log("Old feature");
}

// output:
// New feature
```
