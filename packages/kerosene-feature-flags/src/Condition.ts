enum Comparison {
  ANY = "ANY",
  ALL = "ALL",
  EQUAL = "EQUAL",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN = "GREATER_THAN",
}

type Assertion = {
  field: string;
  negate: boolean;
  comparison?: Comparison;
  of?: (string | number)[];
  exactly?: string | number;
};

type Runtime = { [key: string]: string | number | string[] | number[] };

class Condition {
  // Grammar types
  public must: this = this;

  public to: this = this;

  public be: this = this;

  public any: this = this;

  public all: this = this;

  public not: this = this;

  private assertions: Assertion[] = [];

  // Validate
  public validate(runtime: Runtime): boolean {
    // Check every assertion, against the runtime values
    return this.assertions
      .map(assert => {
        const field = Object.keys(runtime).find(f => assert.field === f);

        if (typeof field === "undefined") {
          return null;
        }

        const value = runtime[field];

        let compare;

        // Make the comparison
        switch (assert.comparison) {
          case Comparison.ANY:
            if (typeof assert.of === "undefined") {
              return false;
            }
            if (Array.isArray(value)) {
              // Any can't handle array
              return false;
            }
            compare = assert.of.some(conditonValue => conditonValue === value);
            break;
          case Comparison.ALL:
            if (typeof assert.of === "undefined") {
              return false;
            }
            if (!Array.isArray(value)) {
              // All must be array
              return false;
            }
            compare = assert.of.every((v, i) => v === value[i]);

            break;
          case Comparison.EQUAL:
            if (typeof assert.exactly === "undefined") {
              return null;
            }
            if (Array.isArray(value)) {
              // Equal can't handle array
              return false;
            }
            compare = assert.exactly === value;
            break;
          case Comparison.LESS_THAN:
            if (typeof assert.exactly === "undefined") {
              return null;
            }
            if (Array.isArray(value)) {
              // Less Than can't handle array
              return false;
            }
            compare = assert.exactly > value;
            break;
          case Comparison.GREATER_THAN:
            if (typeof assert.exactly === "undefined") {
              return null;
            }
            if (Array.isArray(value)) {
              // Greater Than can't handle array
              return false;
            }
            compare = assert.exactly < value;
            break;
          default:
            compare = undefined;
        }

        // Check the comparion, matches our polarity
        if (typeof compare === "undefined") {
          return null;
        }

        if (assert.negate === false) {
          if (compare === true) {
            return true;
          }
          return false;
        }
        if (assert.negate === true) {
          if (compare === false) {
            return true;
          }
          return false;
        }
        return false;
      })
      .filter(value => value !== null)
      .every(result => result === true);
  }

  public condition(field: string): this {
    if (typeof field !== "string") {
      throw new Error("You didn't pass a string to flag.condition");
    }
    this.assertions.push({
      field,
      negate: false,
      comparison: undefined,
    });
    return this;
  }

  public exactly(exactly: string | number): this {
    if (Array.isArray(exactly)) {
      throw new Error("Passed array to flag.exactly");
    }
    if (typeof exactly === "number" || typeof exactly === "string") {
      this.assertions[this.assertions.length - 1] = {
        ...this.assertions[this.assertions.length - 1],
        exactly,
        comparison: Comparison.EQUAL,
      };
      return this;
    }
    throw new Error("You didn't pass an number or string to flag.exactly");
  }

  public of(of: (string | number)[]): this {
    if (!Array.isArray(of)) {
      throw new Error("You didn't pass an array to flag.of");
    }
    this.assertions[this.assertions.length - 1] = {
      ...this.assertions[this.assertions.length - 1],
      of,
    };

    return this;
  }

  public lessThan(exactly: number): this {
    if (typeof exactly !== "number") {
      throw new Error("You didn't pass an number to flag.lessThan");
    }

    this.assertions[this.assertions.length - 1] = {
      ...this.assertions[this.assertions.length - 1],
      exactly,
      comparison: Comparison.LESS_THAN,
    };

    return this;
  }

  public greaterThan(exactly: number): this {
    if (typeof exactly !== "number") {
      throw new Error("You didn't pass an number to flag.greaterThan");
    }
    this.assertions[this.assertions.length - 1] = {
      ...this.assertions[this.assertions.length - 1],
      exactly,
      comparison: Comparison.GREATER_THAN,
    };

    return this;
  }
}

// Grammar helpers
["must", "to", "be"].forEach(word => {
  Object.defineProperty(Condition.prototype, word, {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    set: () => {},
    get() {
      return this;
    },
  });
});

// Comparison Setters
Object.defineProperty(Condition.prototype, "not", {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set: () => {},
  get() {
    this.assertions[this.assertions.length - 1] = {
      ...this.assertions[this.assertions.length - 1],
      negate: true,
    };
    return this;
  },
});

Object.defineProperty(Condition.prototype, "any", {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set: () => {},
  get() {
    this.assertions[this.assertions.length - 1] = {
      ...this.assertions[this.assertions.length - 1],
      comparison: Comparison.ANY,
    };
    return this;
  },
});

Object.defineProperty(Condition.prototype, "all", {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set: () => {},
  get() {
    this.assertions[this.assertions.length - 1] = {
      ...this.assertions[this.assertions.length - 1],
      comparison: Comparison.ALL,
    };
    return this;
  },
});

export { Condition, Runtime };
