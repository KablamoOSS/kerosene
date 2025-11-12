/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import type {
  OverloadedParameters,
  OverloadedReturnType,
} from "@kablamo/kerosene";

/**
 * Shorthand for `jest.Mock<OverloadedReturnType<T>, OverloadedParameters<T>> & T;`
 */
export type JestMock<T> =
  // @ts-expect-error TS2503: @types/jest is not installed
  jest.Mock<OverloadedReturnType<T>, OverloadedParameters<T>> & T;

/**
 * Shorthand for `jest.SpyInstance<OverloadedReturnType<T>, OverloadedParameters<T>> & T;`
 */
export type JestSpied<T> =
  // @ts-expect-error TS2503: @types/jest is not installed
  jest.SpyInstance<OverloadedReturnType<T>, OverloadedParameters<T>> & T;
