/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shorthand for `jest.Mock<ReturnType<T>, Parameters<T>>;`
 */
export type JestMock<T extends (...args: any[]) => any> = jest.Mock<
  ReturnType<T>,
  Parameters<T>
>;

/**
 * Shorthand for `jest.SpyInstance<ReturnType<T>, Parameters<T>>;`
 */
export type JestSpied<T extends (...args: any[]) => any> = jest.SpyInstance<
  ReturnType<T>,
  Parameters<T>
>;
