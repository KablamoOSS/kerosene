import toggle from "./toggle";

describe("#toggle", () => {

  describe("should return an array containing the original array items...", () => {

    describe("plus the needle if the needle is not currently in haystack", () => {

      it("and the haystack is empty", () => {
        const haystack = [] as number[];
        const needle = 4;

        expect(
            toggle(needle, haystack),
        ).toEqual(
            [...haystack, needle],
        );
      });

      it("and the haystack is not empty", () => {
        const haystack = [1, 2, 3];
        const needle = 4;

        expect(
            toggle(needle, haystack),
        ).toEqual(
            [...haystack, needle],
        );
      });

    });

    it("without the needle if the needle is currently in haystack, once", () => {
      const haystack = [1, 2, 3];
      const needle = 2;

      expect(
          toggle(needle, haystack),
      ).toEqual(
          [1, 3],
      );
    });

    it("without the needle if the needle is currently in haystack, multiple times", () => {
      const haystack = [1, 4, 2, 3, 4, 4];
      const needle = 4;

      expect(
          toggle(needle, haystack),
      ).toEqual(
          [1, 2, 3],
      );
    });

  });

});
