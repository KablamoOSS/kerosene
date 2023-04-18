import type { Mutable } from "../types";

/**
 * Deferred is a class that allows a Promise to be created in advance of the code that will `resolve`/`reject` it.
 */
export default class Deferred<T> {
  public readonly promise: Promise<T>;

  public readonly resolve!: (value: T) => void;

  public readonly reject!: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      (this as Mutable<typeof this>).resolve = resolve;
      (this as Mutable<typeof this>).reject = reject;
    });
  }
}
