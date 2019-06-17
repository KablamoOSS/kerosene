# 🔥 Kerosene-test

`@kablamo/kerosene-test` is not yet available on npm.

## Available Functions

### React

#### `createStubComponent(displayName, functional?, getRenderProps?, transformRenderProps?)`

Creates a StubComponent for unit testing.

#### `createStubContext(displayName, getter?)`

Creates a stub React Context for unit testing.

### Stubs

#### `createStubStyles(classNames, values?)`

Returns an object mapping local classNames to faked global equivalents along with any exported values.

#### `stubProperties(target, properties)`

Stubs `properties` on the `target` object, and returns a function which restores them to their original values.

## Available TypeScript Types

### Jest

#### `JestMock<T>`

Shorthand for `jest.Mock<ReturnType<T>, Parameters<T>>;`.

#### `JestSpied<T>`

Shorthand for `jest.SpyInstance<ReturnType<T>, Parameters<T>>;`.

### Sinon

#### `SinonSpied<T>`

Shorthand for `sinon.SinonSpy<Parameters<T>, ReturnType<T>>;`.

#### `SinonStubbed<T>`

Shorthand for `sinon.SinonStub<Parameters<T>, ReturnType<T>>;`.

---

kablamo.com.au
