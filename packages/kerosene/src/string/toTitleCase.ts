import { capitalize } from "lodash";

export const TITLE_CASE_LOWERCASE_WORDS = [
  "a",
  "an",
  "and",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "is",
  "nor",
  "not",
  "on",
  "or",
  "the",
  "to",
  "with",
] as const;

/**
 * Converts an input string to title case, ignoring `lowercaseWords`, except if they are first or last
 * @param input
 * @param lowercaseWords Defaults to `TITLE_CASE_LOWERCASE_WORDS`
 */
export default function toTitleCase(
  input: string,
  lowercaseWords: readonly string[] = TITLE_CASE_LOWERCASE_WORDS,
): string {
  return input
    .split(" ")
    .map((word, index, array) => {
      const lowercase = word.toLowerCase();
      return index === 0 ||
        index === array.length - 1 ||
        !lowercaseWords.includes(lowercase)
        ? capitalize(word)
        : lowercase;
    })
    .join(" ");
}
