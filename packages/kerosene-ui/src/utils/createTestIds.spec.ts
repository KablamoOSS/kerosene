import createTestIds from "./createTestIds";

it("creates the correct test ids", () => {
  // eslint-disable-next-line @kablamo/test-id-prefix-match-path
  const testIds = createTestIds("myPrefix", [
    "wrapper",
    "title",
    "buttonLeft",
    "buttonRight",
  ]);

  expect(testIds).toEqual({
    buttonLeft: "myPrefix#buttonLeft",
    buttonRight: "myPrefix#buttonRight",
    title: "myPrefix#title",
    wrapper: "myPrefix#wrapper",
  });
});
