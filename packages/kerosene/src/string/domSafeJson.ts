import escape from "./escape";

/**
 * These characters are unsafe
 */
const UNSAFE_CHARACTERS_REGEX = /([<\u007f-\uffff])/g;

/**
 * Like `JSON.stringify(value)`, but escaped for safe insertion into the DOM, such as inside a `<script>` tag for SSR
 *
 * Replaces the opening angle bracket and any char codes the range 007f to fffff with a unicode escape code
 *
 * @param value
 */
export default function domSafeJson(value: unknown) {
  return JSON.stringify(value).replace(UNSAFE_CHARACTERS_REGEX, (character) =>
    escape(character),
  );
}
