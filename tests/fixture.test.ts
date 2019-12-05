import { Fixture } from '../src/fixture/fixture';

const matchAnyString = () => expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

describe('Fixture class', () => {
  describe('.create', () => {
    test('should create random values for basic types', () => {
      expect(Fixture.create<string>()).toEqual(matchAnyString());
      expect(Fixture.create<String>()).toEqual(matchAnyString());
      expect(Fixture.create<number>()).toEqual(expect.any(Number));
      expect(Fixture.create<Number>()).toEqual(expect.any(Number));
      expect(Fixture.create<boolean>()).toEqual(expect.any(Boolean));
      expect(Fixture.create<Boolean>()).toEqual(expect.any(Boolean));
      expect(Fixture.create<Function>()).toEqual(expect.any(Function));
      expect(Fixture.create<Date>()).toEqual(expect.any(Date));
      expect(Fixture.create<object>()).toEqual(expect.any(Object));
      expect(Fixture.create<Object>()).toEqual(expect.any(Object));
      expect(Fixture.create<null>()).toBe(null);
      expect(Fixture.create<undefined>()).toBe(undefined);
    });

    test('should create random values for basic array types', () => {
      expect(Fixture.create<string[]>()).toMatchObject([matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString()]);
      expect(Fixture.create<number[][]>()).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)]
      ]);
    });

    test('should create object for interface', () => {
      interface A {
        a: string;
      }

      expect(Fixture.create<A>()).toMatchObject({ a: matchAnyString() });
    });

    test('should create array of objects for interface', () => {
      interface A {
        a: string;
      }

      expect(Fixture.create<A[]>()).toMatchObject([
        { a: matchAnyString() },
        { a: matchAnyString() },
        { a: matchAnyString() },
        { a: matchAnyString() },
        { a: matchAnyString() }
      ]);
    });

    test('should create object for interface with type arguments', () => {
      interface A<T> {
        a: T;
      }

      expect(Fixture.create<A<string>>()).toMatchObject({ a: matchAnyString() });
    });

    test('should create object for class', () => {
      class A {
        a: string;
      }

      expect(Fixture.create<A>()).toMatchObject({ a: matchAnyString() });
    });

    test('should create object for class with type arguments', () => {
      class A<T> {
        a: T;
      }

      expect(Fixture.create<A<number>>()).toMatchObject({ a: expect.any(Number) });
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
        t: C<T[]>
      }

      expect(Fixture.create<A<string>>()).toEqual({
        t: {
          d: expect.any(Number),
          k: {
            l: [matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString()]
          }
        }
      });
    });

    test('should create object by interface with deep nested objects with type arguments', () => {
      interface C<D> {
        d: number;
        k: D;
      }

      interface A<T> {
        t: C<T[]>
      }

      expect(Fixture.create<A<string>>()).toEqual({
        t: {
          d: expect.any(Number),
          k: [matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString()]
        }
      });
    });
  })

  test('should create object by interface with deep nested objects with type arguments', () => {
    interface C<D> {
      d: number;
      k: D;
    }

    interface A<T> {
      t: C<T[]>
    }

    expect(Fixture.create<A<string>>()).toEqual({
      t: {
        d: expect.any(Number),
        k: [matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString()]
      }
    });
  });
})

describe('.createMany', () => {
  test('should create random array values for basic types', () => {
    expect(Fixture.createMany<string[]>(2)).toEqual([
      [matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString()],
      [matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString()]
    ]);
    expect(Fixture.createMany<String>(3)).toEqual([matchAnyString(), matchAnyString(), matchAnyString()]);
    expect(Fixture.createMany<number>(3)).toEqual([expect.any(Number), expect.any(Number), expect.any(Number)]);
    expect(Fixture.createMany<Number>(2)).toEqual([expect.any(Number), expect.any(Number)]);
    expect(Fixture.createMany<boolean>(2)).toEqual([expect.any(Boolean), expect.any(Boolean)]);
    expect(Fixture.createMany<Boolean>(3)).toEqual([expect.any(Boolean), expect.any(Boolean), expect.any(Boolean)]);
    expect(Fixture.createMany<Function>(4)).toEqual([expect.any(Function), expect.any(Function), expect.any(Function), expect.any(Function)]);
    expect(Fixture.createMany<Date>(4)).toEqual([expect.any(Date), expect.any(Date), expect.any(Date), expect.any(Date)]);
    expect(Fixture.createMany<object>(2)).toEqual([expect.any(Object), expect.any(Object)]);
    expect(Fixture.createMany<Object>(3)).toEqual([expect.any(Object), expect.any(Object), expect.any(Object)]);
    expect(Fixture.createMany<null>(2)).toEqual([null, null]);
  });

  test('should create many random objects for interface', () => {
    interface C<D> {
      d: number;
      k: D;
    }

    interface A<T> {
      t: C<T[]>
    }

    const expectedObject = {
      t: {
        d: expect.any(Number),
        k: [matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString(), matchAnyString()]
      }
    };

    expect(Fixture.createMany<A<string>>(2)).toEqual([
      expectedObject, expectedObject
    ]);
  });

  describe('.with', () => {
    test('should register property mutator and apply it on generate post-processing', () => {
      interface B<T> {
        b: T
      }

      class A<T> {
        a: B<T>;
      }

      const result = Fixture
        .build<A<string>>()
        .with(x => x.a.b = 'mutated')
        .create();

      expect(result).toMatchObject({ a: { b: 'mutated' } });
    });

    test('should register many property mutators and apply it on generate post-processing', () => {
      interface B<T> {
        b: T;
        c: number;
      }

      class A<T> {
        a: B<T>;
      }

      const result = Fixture
        .build<A<string>>()
        .with(x => x.a.b = 'mutated')
        .with(x => x.a.c = 1)
        .with(x => x.a.b = 'mutated-2')
        .create();

      expect(result).toMatchObject({ a: { b: 'mutated-2', c: 1 } });
    });
  });
})
