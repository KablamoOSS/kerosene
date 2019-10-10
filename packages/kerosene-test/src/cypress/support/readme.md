# Cypress Commands

Import these commands by adding a file as below to `cypress/support/commands.js`, or add this to your existing commands file.

```js
require("@kablamo/kerosene-test/src/cypress/support/commands");
```

## Commands

`cy.visitStorybook(kind, story);` To navigate to a storybook to test.

`cy.testId(testIds.caption)` to select an element with a `data-test-id` matching the one you pass in.

```js
describe("Button Integration", function() {
  beforeEach(() => {
    cy.visitStorybook("organisms/carousel", "has-title");
  });
  it("can navigate between cards", function() {
    cy.testId(testIds.caption).contains("Case study 1 of 2");
    cy.testId(testIds.carousel).contains("Card One");

    cy.testId(testIds.rightArrow).click();
    cy.testId(testIds.caption).contains("Case study 2 of 2");
    cy.testId(testIds.carousel).contains("Card Two");

    cy.testId(testIds.leftArrow).click();
    cy.testId(testIds.caption).contains("Case study 1 of 2");
    cy.testId(testIds.carousel).contains("Card One");
  });
});
```
