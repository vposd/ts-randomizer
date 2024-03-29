[![License](https://img.shields.io/:license-mit-blue.svg)](https://vposd.mit-license.org/)
[![npm version](https://badge.fury.io/js/ts-randomizer.svg)](https://badge.fury.io/js/ts-randomizer)
[![Release](https://github.com/vposd/ts-randomizer/actions/workflows/release.yml/badge.svg)](https://github.com/vposd/ts-randomizer/actions/workflows/release.yml)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

# Typescript Randomizer
A tool to create random data by requested types.
It's designed to minimize the arrange phase of unit tests to maximize maintainability, making it easier to create objects containing random test data.
So now we don't need for hand-coding anonymous variables as part of a test's arrange phase.

Randomizer can help by creating variables with random data. Here's a simple example:

```typescript
// types
class Entity {
  id: string;
  name: string;
}

interface Response<T> {
  data: T;
}

// test
it('some test', () => {
  const response = Randomizer.create<Response<Entity>>();

  // someClass returns the response data
  const result = someClass.getEntityResult(response);

  expect(result.id).toBe(response.entity.id)
});
```

## Description
Typescript Randomizer includes two parts:
 - Typescript transformer to generate a description for requested types.
 - Randomizer class with methods to create random data according to generated description.

## How to install
Randomizer doesn't work without the typescript transformer. The transformer needs to be provided at compile time. There are many different ways to do it.
[Please read the following guide to find your configuration](https://github.com/vposd/ts-randomizer/blob/master/docs/TRANSFORMER.md)

Also, there are some ready examples:
 - [Jest](https://github.com/vposd/ts-randomizer/tree/master/examples/jest)
 - [Karma](https://github.com/vposd/ts-randomizer/tree/master/examples/karma-webpack)
 - [Angular CLI](https://github.com/vposd/ts-randomizer/tree/master/examples/angular)

## Example usage
### Create random data
```typescript
const data = Randomizer.create<string>();

// "850eb858-f3b7-4d9c-9715-563a7fbd8f0d"
```

### Create many random data
```typescript
interface A {
    a: string;
}

const data = Randomizer.createMany<A>(2);

//
// [
//    { a: "dbb04326-3f0d-4eb1-8bec-2b22fef39f0b" },
//    { a: "3d48ee0b-2004-4745-8453-98b36d260fc4" },
// ]
```
### Create random data with default values
```typescript
interaface A {
    a: string;
}

const data = Randomizer.build<A>()
    .with(x => x.a = 'my string')
    .create();

// { a: "my string" }
```

### Create data for types with type arguments
```typescript
interface B<C, D> {
    c: C[],
    d: D;
}

class A<T> {
    a: B<T, boolean>
}

const data = Randomizer.create<A<string>>();

// {
//   "a":{
//      "c":[
//         "850eb858-f3b7-4d9c-9715-563a7fbd8f0d",
//         "dbb04326-3f0d-4eb1-8bec-2b22fef39f0b",
//         "10efb53e-a76f-4b34-83b5-b7cf9a913e46",
//         "3d48ee0b-2004-4745-8453-98b36d260fc4",
//         "11774a70-488c-48d5-bb80-b367ecd857ed"
//      ],
//      "d":true
//   }
// }
```
For more examples, take a look for tests folder

# License
This project is licensed under the MIT License
