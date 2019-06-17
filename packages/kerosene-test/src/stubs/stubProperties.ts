export type TypedPropertyDescriptorMap<T> = {
  [P in keyof T]?: TypedPropertyDescriptor<T[P]>;
};

/**
 * Stubs `properties` on the `target` object, and returns a function which restores them to their original values.
 * @param target
 * @param properties
 */
export default function stubProperties<T>(
  target: T,
  properties: TypedPropertyDescriptorMap<T> & ThisType<T>,
) {
  const previousProperties = Object.keys(properties).reduce(
    (acc, property) => {
      const descriptor = Object.getOwnPropertyDescriptor(target, property);
      return descriptor ? { ...acc, [property]: descriptor } : acc;
    },
    {} as PropertyDescriptorMap & ThisType<any>,
  );

  Object.defineProperties(target, properties as PropertyDescriptorMap &
    ThisType<any>);

  return () => {
    Object.defineProperties(target, previousProperties);
  };
}
