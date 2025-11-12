import kebabCase from "lodash/kebabCase";

/**
 * Returns an object mapping local classNames to faked global equivalents along with any exported values.
 * @param classNames array of local classNames from styles file
 * @param values Record containing exported values
 */
export default function createStubStyles<
  C extends string,
  V extends Record<string, string> = Record<string, never>,
>(classNames: readonly C[], values: V = {} as V): V & { [key in C]: string } {
  Object.entries(values).forEach(([property, value]) => {
    const type = typeof value;
    if (type !== "string") {
      throw new TypeError(
        `The property: '${property}' with value '${value}' in createStubStyles(, values) must be a string, but was ${type}`,
      );
    }
  });

  const obj = {
    ...values,
    ...(Object.fromEntries(
      classNames.map<[C, string]>((className) => [
        className,
        `${kebabCase(className)}-local-class ${kebabCase(
          className,
        )}-webpack-composed-class`,
      ]),
    ) as Record<C, string>),
  };

  // Use a Proxy to throw an error when trying to access styles which haven't been stubbed
  return new Proxy(obj, {
    get: (target, property: string) => {
      if (property in target || ["__esModule"].includes(property)) {
        return (target as Record<string, unknown>)[property];
      }
      throw new TypeError(
        `ERROR: The property '${property}' was not mocked in the stubbed CSS Modules mapping: ${JSON.stringify(
          target,
        )}. You need to list this value in either classNames or values when calling createStubStyles(classNames, values?);`,
      );
    },
  });
}
