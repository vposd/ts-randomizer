[![npm version](https://badge.fury.io/js/ts-randomizer.svg)](https://badge.fury.io/js/ts-randomizer) [![Build Status](https://travis-ci.com/vposd/ts-randomizer.svg?branch=master)](https://travis-ci.com/vposd/ts-randomizer) [![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

# Typescript Randomizer
A tool to create random data by requested types.
It's designed to minimize the arrange phase of unit tests in order to maximize maintainability, making it easier to create objects containing random test data.

## Description
Typescript Randomizer includes two parts:
 - Typescript transformer to generate a description for requested types.
 - Randomizer class with methods to create random data by requested types.

## How to install
Randomizer doesn't work without the typescript transformer. The transformer needs to be provided at compile time. There are many different ways to do it.
[Please read the following guide to find your configuration](https://github.com/vposd/ts-randomizer/blob/master/docs/TRANSFORMER.md)

Also, there are some ready examples:
 - [Jest](https://github.com/vposd/ts-randomizer/tree/master/examples/jest)
 - [Karma](https://github.com/vposd/ts-randomizer/tree/master/examples/karma-webpack)
 - Angular CLI

## Example usage
### Create random data
```typescript
const data = Randomizer.create<string>();

console.log(data);

// "850eb858-f3b7-4d9c-9715-563a7fbd8f0d"
```

### Create many random data
```typescript
interface A {
    a: string;
}

const data = Randomizer.createMany<A>(2);

console.log(data);

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

console.log(data);

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
console.log(data);

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