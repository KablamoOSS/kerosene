import { OverloadedParameters, OverloadedReturnType } from "@kablamo/kerosene";
import sinon from "sinon";

/**
 * Shorthand for `sinon.SinonSpy<OverloadedParameters<T>, OverloadedReturnType<T>> & T;`
 */
export type SinonSpied<T> = sinon.SinonSpy<
  OverloadedParameters<T>,
  OverloadedReturnType<T>
> &
  T;

/**
 * Shorthand for `sinon.SinonStub<OverloadedParameters<T>, OverloadedReturnType<T>> & T;`
 */
export type SinonStubbed<T> = sinon.SinonStub<
  OverloadedParameters<T>,
  OverloadedReturnType<T>
> &
  T;
