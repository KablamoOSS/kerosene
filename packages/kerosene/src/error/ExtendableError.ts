/**
 * NOTE: `class MyError extends Error` does not work correctly with the `instanceof` operator in some environments like
 * Jest where ES6 classes are downleveled. Instead of directly extending `Error`, extending this class will ensure that
 * the `instanceof` operator works correctly.
 *
 * @example
 * ```typescript
 * class MyError extends ExtendableError {}
 * ```
 *
 * @see https://github.com/Microsoft/TypeScript/issues/13965
 */
export default class ExtendableError extends Error {
  constructor(message?: string) {
    super(message);

    // NOTE: This is required for some environments like Jest where ES6 classes are downleveled to ES5 syntax. This
    // breaks the the `instanceof` operator for `class MyError extends Error {}`
    // i.e. `(new MyError instanceof MyError) === false`
    // Instead `class MyError extends ExtendableError {}` and `new MyError instanceof MyError` will work as expected
    // @see https://github.com/Microsoft/TypeScript/issues/13965
    //
    // This is safe to call in ES6+ environments, but can cause significant deoptimisation, so avoid it unless necessary
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf#:~:text=very%20slow%20operation
    /* istanbul ignore if */
    if (!(this instanceof ExtendableError)) {
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
}
