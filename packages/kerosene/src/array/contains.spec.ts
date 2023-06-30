import contains from "./contains";

describe("#contains", () => {
  describe("with no user-defined iteratee", () => {
    it("should return true when both arrays are empty", () => {
      expect(contains([], [])).toBe(true);
    });

    it("should return true when both arrays are referentially equal", () => {
      const myArray = [1, 2, 3];

      expect(contains(myArray, myArray)).toBe(true);
    });

    it("should return true when both arrays have the same values, referentially", () => {
      const a = Math.random();
      const b = Math.random();

      const array1 = [a, b];
      const array2 = [b, a];

      expect(contains(array1, array2)).toBe(true);
    });

    it("should return false when the superset has fewer values than the subset", () => {
      const subset = [1, 2, 3, 4, 5];
      const superset = [1, 2, 3];

      expect(contains(superset, subset)).toBe(false);
    });

    it("should return true when all of the items in the subset can be found in the superset", () => {
      const subset = [1, 2, 3];
      const superset = [1, 2, 3, 4, 5];

      expect(contains(superset, subset)).toBe(true);
    });

    it("should return false when there are values in the subset which are not in the superset", () => {
      const array1 = [1, 2, 3, 4, 5];
      const array2 = [1, 2, 3, 4, 10, 12, 15];

      expect(contains(array2, array1)).toBe(false);
    });
  });

  describe("with a user-defined iteratee", () => {
    const randomizer = () => Math.random();
    const lowerCaser = (input: string): string => input.toLowerCase();
    const routeDown = (input: number): number => Math.floor(input);

    it("should call the iteratee when passed one, passing each value into it", () => {
      const iteratee: jest.MockedFn<
        NonNullable<Parameters<typeof contains>[2]>
      > = jest.fn();

      const someValues = [
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
      ];

      contains(someValues, someValues.slice(1, 3), iteratee);

      expect(
        iteratee.mock.calls.every((calledArgs) => {
          return someValues.includes(calledArgs[0] as number);
        }),
      ).toBe(true);
    });

    it("should return true when both arrays are empty", () => {
      expect(contains([], [], randomizer)).toBe(true);
    });

    it("should return true when both arrays are referentially equal", () => {
      const myArray = [1, 2, 3];

      expect(contains(myArray, myArray, randomizer)).toBe(true);
    });

    it("should return false when the superset has fewer values than the subset", () => {
      const subset = [1, 2, 3, 4, 5];
      const superset = [1, 2, 3];

      expect(contains(superset, subset)).toBe(false);
    });

    it("should return true when all of the items in the subset can be found in the superset, after being passed thru the iteratee", () => {
      const uppers = ["ONE", "TWO", "THREE", "FOUR"];
      const lowers = ["two", "four"];

      expect(contains(uppers, lowers, lowerCaser)).toBe(true);
    });

    it("should return false when there are values in the subset which are not in the superset, after being passed thru the iteratee", () => {
      const array1 = [1, 2, 3.5, 4, 5];
      const array2 = [1, 2.5, 3, 4.1, 10, 12, 15];

      expect(contains(array2, array1, routeDown)).toBe(false);
    });
  });
});
