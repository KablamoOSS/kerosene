import type {
  OverloadedParameters,
  OverloadedReturnType,
} from "@kablamo/kerosene";

/**
 * Shorthand for `jest.Mock<OverloadedReturnType<T>, OverloadedParameters<T>> & T;`
 */
export type JestMock<T> = jest.Mock<
  OverloadedReturnType<T>,
  OverloadedParameters<T>
> &
  T;

/**
 * Shorthand for `jest.SpyInstance<OverloadedReturnType<T>, OverloadedParameters<T>> & T;`
 */
export type JestSpied<T> = jest.SpyInstance<
  OverloadedReturnType<T>,
  OverloadedParameters<T>
> &
  T;
