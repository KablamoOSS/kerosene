import ExtendableError from "./ExtendableError";

describe("ExtendableError", () => {
  it("should work correctly with instanceof", () => {
    class CustomError extends ExtendableError {}
    expect(new CustomError()).toBeInstanceOf(Error);
    expect(new CustomError()).toBeInstanceOf(ExtendableError);
    expect(new CustomError()).toBeInstanceOf(CustomError);
  });
});
