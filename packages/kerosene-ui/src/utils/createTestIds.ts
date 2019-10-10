export default function createTestIds<N extends string>(
  name: string,
  components: readonly N[],
): { [key in N]: string } {
  return components.reduce(
    (acc, component) => ({
      ...acc,
      [component]: `${name}#${component}`,
    }),
    {} as { [key in N]: string },
  );
}
