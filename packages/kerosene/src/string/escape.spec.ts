import escape from "./escape";

describe("#escape", () => {
  it("should replace the input with a sequence of Unicode escape sequences", () => {
    expect(escape("💯")).toBe("\\ud83d\\udcaf");
  });
});
