Cypress.Commands.add("visitStorybook", (path, storybookName, options = {}) => {
  cy.visit(
    `iframe.html?selectedKind=${encodeURIComponent(
      path,
    )}&selectedStory=${encodeURIComponent(storybookName)}`,
    options,
  );
});
Cypress.Commands.add("testId", (testId, options) => {
  cy.get(`[data-test-id="${testId}"]`, options);
});
