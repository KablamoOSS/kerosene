/* eslint-disable @typescript-eslint/no-explicit-any */

import sinon from "sinon";

/**
 * Shorthand for `sinon.SinonSpy<Parameters<T>, ReturnType<T>>;`
 */
export type SinonSpied<T extends (...args: any[]) => any> = sinon.SinonSpy<
  Parameters<T>,
  ReturnType<T>
>;

/**
 * Shorthand for `sinon.SinonStub<Parameters<T>, ReturnType<T>>;`
 */
export type SinonStubbed<T extends (...args: any[]) => any> = sinon.SinonStub<
  Parameters<T>,
  ReturnType<T>
>;
