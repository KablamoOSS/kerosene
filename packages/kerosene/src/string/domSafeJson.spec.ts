import domSafeJson from "./domSafeJson";

describe("domSafeJson", () => {
  it("should escape ampersand and angle brackets", () => {
    expect(
      domSafeJson({
        field: "&</script>",
      }),
    ).toBe('{"field":"\\u0026\\u003c/script\\u003e"}');
  });

  it("should escape unicode characters in the range 007f to ffff", () => {
    expect(
      domSafeJson({
        field: "\u007f\uffff",
      }),
    ).toBe('{"field":"\\u007f\\uffff"}');
  });
});
