import domSafeJson from "./domSafeJson";

describe("domSafeJson", () => {
  it("should escape the opening angle bracket", () => {
    expect(
      domSafeJson({
        field: "</script>",
      }),
    ).toBe('{"field":"\\u003c/script>"}');
  });

  it("should escape unicode characters in the range 007f to ffff", () => {
    expect(
      domSafeJson({
        field: "\u007f\uffff",
      }),
    ).toBe('{"field":"\\u007f\\uffff"}');
  });
});
