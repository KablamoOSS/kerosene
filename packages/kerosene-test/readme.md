# 🔥 Kerosene-test

```
yarn add --dev @kablamo/kerosene-test

npm install --save-dev @kablamo/kerosene-test
```

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

Shorthand for `jest.Mock<OverloadedReturnType<T>, OverloadedParameters<T>> & T;`.

#### `JestSpied<T>`

Shorthand for `jest.SpyInstance<OverloadedReturnType<T>, OverloadedParameters<T>> & T;`.

### Sinon

#### `SinonSpied<T>`

Shorthand for `sinon.SinonSpy<OverloadedParameters<T>, OverloadedReturnType<T>> & T;`.

#### `SinonStubbed<T>`

Shorthand for `sinon.SinonStub<OverloadedParameters<T>, OverloadedReturnType<T>> & T;`.

---

kablamo.com.au
