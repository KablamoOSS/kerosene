declare class JestSandbox {
  fn: typeof jest["fn"];

  spyOn: typeof jest["spyOn"];

  clear(): void;

  reset(): void;

  restore(): void;
}

declare module "jest-sandbox" {
  const createSandbox: () => JestSandbox;

  export = createSandbox;
}
