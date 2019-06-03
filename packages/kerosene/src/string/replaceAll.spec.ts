import replaceAll from "./replaceAll";

describe("#replaceAll", () => {

  it("should return the input as-is if there are no instances of the text to replace in the input", () => {
    expect(
        replaceAll("world", "boys", "hello, world!")
    ).toBe(
        "hello, boys!"
    );
  });

  it("should replace all occurrences of the text to replace with the replacement", () => {
    expect(
        replaceAll("boy", "world", "oh boy, hello boys!")
    ).toBe(
        "oh world, hello worlds!"
    );

    expect(
        replaceAll("hi", "bye", "hihihi")
    ).toBe(
        "byebyebye"
    );

    expect(
        replaceAll("a", "", "aaaaa")
    ).toBe(
        ""
    );
  });

});
