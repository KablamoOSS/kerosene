import { kebabCase } from "lodash";

/**
 * Returns an object mapping local classNames to faked global equivalents along with any exported values.
 * @param classNames List of local classNames from styles file
 * @param values Map of exported values (values MUST be strings)
 */
export default function createStubStyles<C extends string, V extends {}>(
  classNames: C[],
  values = {} as V,
): V & { [key in C]: string } {
  Object.entries(values).forEach(([property, value]) => {
    const type = typeof value;
    if (type !== "string") {
      throw new TypeError(
        `The property: '${property}' with value '${value}' in createStubStyles(, values) must be a string, but was ${type}`,
      );
    }
  });

  const obj = classNames.reduce<V & { [key in C]: string }>(
    (acc, className) =>
      ({
        ...(acc as V & { [key in C]: string }),
        [className]: `${kebabCase(className)}-local-class ${kebabCase(
          className,
        )}-webpack-composed-class`,
      } as V & { [key in C]: string }),
    values as V & { [key in C]: string },
  );

  // Use a Proxy to throw an error when trying to access styles which haven't been stubbed
  return new Proxy(obj, {
    get: (target, property: string) => {
      if (property in target || ["__esModule"].includes(property)) {
        return (target as any)[property];
      }
      throw new TypeError(
        `ERROR: The property '${property}' was not mocked in the stubbed CSS Modules mapping: ${JSON.stringify(
          target,
        )}. You need to list this value in either classNames or values when calling createStubStyles(classNames, values?);`,
      );
    },
  });
}
