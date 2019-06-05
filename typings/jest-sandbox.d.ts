declare module "jest-sandbox" {
  global {
    export class JestSandbox {
      fn: typeof jest["fn"];
      spyOn: typeof jest["spyOn"];
      clear(): void;
      reset(): void;
      restore(): void;
    }
  }

  const createSandbox: () => JestSandbox;

  export = createSandbox;
}
