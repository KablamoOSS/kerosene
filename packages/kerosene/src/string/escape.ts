/**
 * Returns the Unicode escape sequences for the provided input string
 * @param input
 */
export default function escape(input: string) {
  return input
    .split("")
    .map(
      character =>
        `\\u${character
          .charCodeAt(0)
          .toString(16)
          .padStart(4, "0")}`,
    )
    .join("");
}
