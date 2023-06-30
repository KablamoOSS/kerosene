import timeout from "../function/timeout";
import Deferred from "./Deferred";

describe("Deferred", () => {
  it("should allow a Promise to be created and resolved", async () => {
    const deferred = new Deferred<boolean>();
    deferred.resolve(true);

    await expect(deferred.promise).resolves.toBe(true);
  });

  it("should allow a Promise to be created and reject", async () => {
    const deferred = new Deferred();
    const error = new Error("an error");
    // Promise must be rejected _after_ a catch handler has been attached or we will see UnhandledPromiseRejection from Node
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    timeout(0).then(() => deferred.reject(error));

    await expect(deferred.promise).rejects.toBe(error);
  });
});
