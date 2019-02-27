import isOnlyWhitespace from "./isOnlyWhitespace";

describe("#isOnlyWhitespace", () => {

  it("should return true when the input string is an empty string", () => {
    expect(
        isOnlyWhitespace(""),
    ).toBe(
        true,
    );

    expect(
        isOnlyWhitespace(``),
    ).toBe(
        true,
    );
  });

  it("should return true when the input string is a single space", () => {
    expect(
        isOnlyWhitespace(' ')
    ).toBe(
        true
    );
  });

  it("should return true when the input string is only multiple spaces", () => {
    expect(
        isOnlyWhitespace(' '.repeat(20))
    ).toBe(
        true
    );
  });

  it("should return true when the input string is one newline, of any type", () => {
    expect(
        isOnlyWhitespace('\n')
    ).toBe(
        true
    );

    expect(
        isOnlyWhitespace('\r')
    ).toBe(
        true
    );
  });

  it("should return true when the input string is a multiline template string", () => {
    expect(
        isOnlyWhitespace(`
        
        `)
    ).toBe(
        true
    );
  });

  it("should return true when the input string is only newlines of any type", () => {
    expect(
        isOnlyWhitespace('\n\n\n')
    ).toBe(
        true
    );

    expect(
        isOnlyWhitespace('\r\r\r')
    ).toBe(
        true
    );

    expect(
        isOnlyWhitespace('\n\r\n\r\n\r')
    ).toBe(
        true
    );
  });

  it("should return false when the input is only non-whitespace characters", () => {
    expect(
        isOnlyWhitespace('HEYBARTWANNASEEMYNEWCHAINSAWANDHOCKEYMASK?')
    ).toBe(
        false
    );
  });

  describe("should return false when the input contains non-whitespace characters...", () => {

    it("at the start", () => {
      expect(
          isOnlyWhitespace("     whyistherumalwaysgone")
      ).toBe(
          false
      );
    });

    it("in the middle", () => {
      expect(
          isOnlyWhitespace("stuck in the middle with you")
      ).toBe(
          false
      );
    });

    it("at the end", () => {
      expect(
          isOnlyWhitespace("We regret to inform you...      ")
      ).toBe(
          false
      );
    });

  });

});
