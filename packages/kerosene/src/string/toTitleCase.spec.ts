import capitalize from "lodash/capitalize";
import toTitleCase, { TITLE_CASE_LOWERCASE_WORDS } from "./toTitleCase";

describe("#toTitleCase", () => {
  it("should capitalise normal words", () => {
    expect(toTitleCase("title case")).toBe("Title Case");
  });

  it("should leave excluded words uncapitalised", () => {
    TITLE_CASE_LOWERCASE_WORDS.forEach((word) => {
      expect(toTitleCase(`few ${word} far between`)).toBe(
        `Few ${word} Far Between`,
      );
    });
  });

  it("should capitalise the first word even if it is on the list", () => {
    TITLE_CASE_LOWERCASE_WORDS.forEach((word) => {
      expect(toTitleCase(`${word} title`)).toBe(`${capitalize(word)} Title`);
    });
  });

  it("should capitalise the last word even if it is on the list", () => {
    TITLE_CASE_LOWERCASE_WORDS.forEach((word) => {
      expect(toTitleCase(`far ${word}`)).toBe(`Far ${capitalize(word)}`);
    });
  });

  it("should capitalise words not included in the provided list", () => {
    expect(toTitleCase(TITLE_CASE_LOWERCASE_WORDS.join(" "), [])).toBe(
      TITLE_CASE_LOWERCASE_WORDS.map(capitalize).join(" "),
    );
  });
});
