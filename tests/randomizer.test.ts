import { PropertyType } from '../src/types';
import { Randomizer } from '../src/randomizer/randomizer';
import { SpecimenFactory } from '../src/randomizer/spicemen-factory';

const matchAnyString = () =>
  expect.stringMatching(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

describe('Randomizer class', () => {
  describe('.create', () => {
    test('should return undefined if description has not been provided', () => {
      expect(Randomizer.create()).toBeUndefined();
    });

    test('should create random values for basic types', () => {
      expect(Randomizer.create<string>()).toEqual(matchAnyString());
      expect(Randomizer.create<number>()).toEqual(expect.any(Number));
      expect(Randomizer.create<boolean>()).toEqual(expect.any(Boolean));
      expect(Randomizer.create<Function>()).toEqual(expect.any(Function));
      expect(Randomizer.create<Date>()).toEqual(expect.any(Date));
      expect(Randomizer.create<object>()).toEqual(expect.any(Object));
      expect(Randomizer.create<null>()).toBe(null);
      expect(Randomizer.create<undefined>()).toBe(undefined);
    });

    test('should create randon=m value for unknown type', () => {
      expect(Randomizer.create<unknown>()).toEqual(expect.anything());
    });

    test('should create random values for basic array types', () => {
      expect(Randomizer.create<string[]>()).toMatchObject([
        matchAnyString(),
        matchAnyString(),
        matchAnyString(),
        matchAnyString(),
        matchAnyString(),
      ]);
      expect(Randomizer.create<number[][]>()).toMatchObject([
        [
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ],
        [
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ],
        [
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ],
        [
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ],
        [
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ],
      ]);
    });

    test('should create object for turple type', () => {
      expect(Randomizer.create<[number]>()).toMatchObject([expect.any(Number)]);
    });

    test('should create object for interface', () => {
      interface A {
        a: string;
      }

      expect(Randomizer.create<A>()).toMatchObject({ a: matchAnyString() });
    });

    test('should create array of objects for interface', () => {
      interface A {
        a: string;
      }

      expect(Randomizer.create<A[]>()).toMatchObject([
        { a: matchAnyString() },
        { a: matchAnyString() },
        { a: matchAnyString() },
        { a: matchAnyString() },
        { a: matchAnyString() },
      ]);
    });

    test('should create object for interface with type arguments', () => {
      interface A<T> {
        a: T;
      }

      expect(Randomizer.create<A<string>>()).toMatchObject({
        a: matchAnyString(),
      });
    });

    test('should create object for class', () => {
      class A {
        a!: string;
      }

      expect(Randomizer.create<A>()).toMatchObject({ a: matchAnyString() });
    });

    test('should create object for class with type arguments', () => {
      class A<T> {
        a!: T;
      }

      expect(Randomizer.create<A<number>>()).toMatchObject({
        a: expect.any(Number),
      });
    });

    test('should create object by interface with deep nested objects with type arguments', () => {
      interface K<L> {
        l: L;
      }

      interface C<D> {
        d: number;
        k: K<D>;
      }

      interface A<T> {
        t: C<T[]>;
      }

      expect(Randomizer.create<A<string>>()).toEqual({
        t: {
          d: expect.any(Number),
          k: {
            l: [
              matchAnyString(),
              matchAnyString(),
              matchAnyString(),
              matchAnyString(),
              matchAnyString(),
            ],
          },
        },
      });
    });

    test('should create object by interface with deep nested objects with type arguments', () => {
      interface C<D> {
        d: number;
        k: D;
      }

      interface A<T> {
        t: C<T[]>;
      }

      expect(Randomizer.create<A<string>>()).toEqual({
        t: {
          d: expect.any(Number),
          k: [
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
          ],
        },
      });
    });

    test('should create object by interface with deep nested objects with type arguments', () => {
      interface C<D> {
        d: number;
        k: D;
      }

      interface A<T> {
        t: C<T[]>;
      }

      expect(Randomizer.create<A<string>>()).toEqual({
        t: {
          d: expect.any(Number),
          k: [
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
          ],
        },
      });
    });
  });

  describe('.createMany', () => {
    test('should return undefined if description has not been provided', () => {
      expect(Randomizer.createMany()).toBeUndefined();
    });

    test('should create random array values for basic types', () => {
      expect(Randomizer.createMany<string[]>(2)).toEqual([
        [
          matchAnyString(),
          matchAnyString(),
          matchAnyString(),
          matchAnyString(),
          matchAnyString(),
        ],
        [
          matchAnyString(),
          matchAnyString(),
          matchAnyString(),
          matchAnyString(),
          matchAnyString(),
        ],
      ]);
      expect(Randomizer.createMany<number>(3)).toEqual([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(Randomizer.createMany<boolean>(2)).toEqual([
        expect.any(Boolean),
        expect.any(Boolean),
      ]);
      expect(Randomizer.createMany<Function>(4)).toEqual([
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      ]);
      expect(Randomizer.createMany<Date>(4)).toEqual([
        expect.any(Date),
        expect.any(Date),
        expect.any(Date),
        expect.any(Date),
      ]);
      expect(Randomizer.createMany<object>(2)).toEqual([
        expect.any(Object),
        expect.any(Object),
      ]);
      expect(Randomizer.createMany<null>(2)).toEqual([null, null]);
    });

    test('should create many random objects for interface', () => {
      interface C<D> {
        d: number;
        k: D;
      }

      interface A<T> {
        t: C<T[]>;
      }

      const expectedObject = {
        t: {
          d: expect.any(Number),
          k: [
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
            matchAnyString(),
          ],
        },
      };

      expect(Randomizer.createMany<A<string>>(2)).toEqual([
        expectedObject,
        expectedObject,
      ]);
    });
  });

  describe('.build', () => {
    test('should throw error if description has not been provided', () => {
      expect(Randomizer.build).toThrowError(
        '[Randomizer] Error: Missing type description'
      );
    });
  });

  describe('.with', () => {
    test('should register property mutator and apply it on generate post-processing', () => {
      interface B<T> {
        b: T;
      }

      class A<T> {
        a!: B<T>;
      }

      const result = Randomizer.build<A<string>>()
        .with(x => (x ? (x.a.b = 'mutated') : x))
        .create();

      expect(result).toMatchObject({ a: { b: 'mutated' } });
    });

    test('should register many property mutators and apply it on generate post-processing', () => {
      interface B<T> {
        b: T;
        c: number;
      }

      class A<T> {
        a!: B<T>;
      }

      const result = Randomizer.build<A<string>>()
        .with(x => (x ? (x.a.b = 'mutated') : x))
        .with(x => (x ? (x.a.c = 1) : x))
        .with(x => (x ? (x.a.b = 'mutated-2') : x))
        .create();

      expect(result).toMatchObject({ a: { b: 'mutated-2', c: 1 } });
    });
  });
});

describe('SpicemenFactory', () => {
  describe('.create', () => {
    test('should not throw error if key of property description is null', () => {
      const spicemen = new SpecimenFactory([
        { key: '', description: PropertyType.String },
        { key: 'a', description: PropertyType.Number },
      ]);
      expect(spicemen.create()).toMatchObject({
        a: expect.any(Number),
      });
    });
  });

  describe('.createMany', () => {
    test('should create an empty array if arguments has not been provided', () => {
      const spicemen = new SpecimenFactory(PropertyType.String);
      expect(spicemen.createMany()).toMatchObject([]);
    });
  });
});
