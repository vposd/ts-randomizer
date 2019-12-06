import { PropertyType } from '../src/types';

class Randomizer {
  static create = <T>(a?: T) => a;
}

describe('Test transformer.', () => {
  test('should generate description for basic type', () => {
    expect(Randomizer.create<string>()).toBe(PropertyType.String);
    expect(Randomizer.create<number>()).toBe(PropertyType.Number);
    expect(Randomizer.create<boolean>()).toBe(PropertyType.Boolean);
    expect(Randomizer.create<Function>()).toBe(PropertyType.Function);
    expect(Randomizer.create<Date>()).toBe(PropertyType.Date);
    expect(Randomizer.create<object>()).toBe(PropertyType.Object);
    expect(Randomizer.create<null>()).toBe(PropertyType.Null);
    expect(Randomizer.create<undefined>()).toBe(PropertyType.Undefined);
  });

  test('should generate description for basic array type', () => {
    expect(Randomizer.create<string[]>()).toMatchObject({
      isArray: true,
      type: PropertyType.String,
    });
    expect(Randomizer.create<number[][][]>()).toMatchObject({
      isArray: true,
      type: {
        isArray: true,
        type: { isArray: true, type: PropertyType.Number },
      },
    });
    expect(Randomizer.create<boolean[]>()).toMatchObject({
      isArray: true,
      type: PropertyType.Boolean,
    });
    expect(Randomizer.create<Function[]>()).toMatchObject({
      isArray: true,
      type: PropertyType.Function,
    });
    expect(Randomizer.create<Date[]>()).toMatchObject({
      isArray: true,
      type: PropertyType.Date,
    });
    expect(Randomizer.create<object[]>()).toMatchObject({
      isArray: true,
      type: PropertyType.Object,
    });
    expect(Randomizer.create<null[]>()).toMatchObject({
      isArray: true,
      type: PropertyType.Null,
    });
  });

  test('should generate description for interface', () => {
    interface A {
      a: string;
    }

    expect(Randomizer.create<A>()).toMatchObject([
      { key: 'a', type: PropertyType.String },
    ]);
  });

  test('should generate description for class', () => {
    class A {
      a: string;
    }

    expect(Randomizer.create<A>()).toMatchObject([
      { key: 'a', type: PropertyType.String },
    ]);
  });

  test('should generate description for interface with different type parameters', () => {
    interface A<B, C, D, F> {
      b: B;
      c: C;
      d: D[];
      f: F[][];
    }

    expect(
      Randomizer.create<A<string, number[], boolean[], object[][]>>()
    ).toMatchObject([
      { key: 'b', type: PropertyType.String },
      { key: 'c', isArray: true, type: PropertyType.Number },
      {
        key: 'd',
        isArray: true,
        type: { isArray: true, type: PropertyType.Boolean },
      },
      {
        key: 'f',
        isArray: true,
        type: {
          isArray: true,
          type: {
            isArray: true,
            type: { isArray: true, type: PropertyType.Object },
          },
        },
      },
    ]);
  });

  test('should generate description for class with different type parameters', () => {
    class A<B, C, D, F> {
      b: B;
      c: C;
      d: D[];
      f: F[][];
    }

    expect(
      Randomizer.create<A<string, number[], boolean[], object[][]>>()
    ).toMatchObject([
      { key: 'b', type: PropertyType.String },
      { key: 'c', isArray: true, type: PropertyType.Number },
      {
        key: 'd',
        isArray: true,
        type: { isArray: true, type: PropertyType.Boolean },
      },
      {
        key: 'f',
        isArray: true,
        type: {
          isArray: true,
          type: {
            isArray: true,
            type: { isArray: true, type: PropertyType.Object },
          },
        },
      },
    ]);
  });

  test('should generate description for interface with high order type parameters', () => {
    interface C {
      c: string;
    }

    interface B<T> {
      b: T;
    }

    interface A<Y> {
      a: Y;
    }

    expect(Randomizer.create<A<B<C>>>()).toMatchObject([
      {
        key: 'a',
        type: [
          {
            key: 'b',
            type: [{ key: 'c', type: PropertyType.String }],
          },
        ],
      },
    ]);
  });

  test('should generate description for class with high order type parameters', () => {
    class C<M> {
      c: M;
    }

    class B<T> {
      b: T;
    }

    class A<Y> {
      a: Y;
    }

    expect(Randomizer.create<A<B<C<boolean>>>>()).toMatchObject([
      {
        key: 'a',
        type: [
          {
            key: 'b',
            type: [{ key: 'c', type: PropertyType.Boolean }],
          },
        ],
      },
    ]);
  });

  test('should generate description for interface with high order props type params', () => {
    interface C<N> {
      n: N;
    }
    interface B<G> {
      g: G;
    }

    interface A<T> {
      a: B<C<T>>;
    }

    expect(Randomizer.create<A<string[]>>()).toEqual([
      {
        key: 'a',
        isArray: false,
        type: [
          {
            key: 'g',
            isArray: false,
            type: [{ key: 'n', isArray: true, type: PropertyType.String }],
          },
        ],
      },
    ]);
  });

  test('should generate description for class with high order props type params', () => {
    class C<N> {
      n: N;
    }
    class B<G> {
      g: G;
    }

    class A<T> {
      a: B<C<T>>;
    }

    expect(Randomizer.create<A<string[]>>()).toEqual([
      {
        key: 'a',
        isArray: false,
        type: [
          {
            key: 'g',
            isArray: false,
            type: [{ key: 'n', isArray: true, type: PropertyType.String }],
          },
        ],
      },
    ]);
  });

  test('should generate description for interface with high order props array type params', () => {
    interface C<N, D> {
      n: N[];
      d: D;
    }
    interface B<G> {
      g: G[];
    }

    interface A<T, R> {
      a: B<C<T[], R>>;
    }

    expect(Randomizer.create<A<string[], boolean>>()).toEqual([
      {
        key: 'a',
        isArray: false,
        type: [
          {
            key: 'g',
            isArray: true,
            type: [
              {
                key: 'n',
                isArray: true,
                type: { isArray: true, type: PropertyType.String },
              },
              { key: 'd', isArray: false, type: PropertyType.Boolean },
            ],
          },
        ],
      },
    ]);
  });

  test('should generate description for class with high order props array type params', () => {
    class C<N, D> {
      n: N[];
      d: D;
    }
    class B<G> {
      g: G[];
    }

    class A<T, R> {
      a: B<C<T[], R>>;
    }

    expect(Randomizer.create<A<string[], boolean>>()).toEqual([
      {
        key: 'a',
        isArray: false,
        type: [
          {
            key: 'g',
            isArray: true,
            type: [
              {
                key: 'n',
                isArray: true,
                type: { isArray: true, type: PropertyType.String },
              },
              { key: 'd', isArray: false, type: PropertyType.Boolean },
            ],
          },
        ],
      },
    ]);
  });

  test('should generate description for interface with different type parameters', () => {
    interface K<L, M> {
      l: L[][];
      m: M[];
    }

    interface E<H, I> {
      h: H;
      i: Array<K<H, I[]>>;
    }

    interface A<B, C> {
      b: B;
      c: C;
    }

    expect(Randomizer.create<A<Array<E<string, number>>, object>>()).toEqual([
      {
        key: 'b',
        isArray: true,
        type: [
          { key: 'h', isArray: false, type: PropertyType.String },
          {
            key: 'i',
            isArray: true,
            type: [
              {
                key: 'l',
                isArray: true,
                type: { isArray: true, type: PropertyType.String },
              },
              {
                key: 'm',
                isArray: true,
                type: { isArray: true, type: PropertyType.Number },
              },
            ],
          },
        ],
      },
      { key: 'c', isArray: false, type: PropertyType.Object },
    ]);
  });

  test('should generate description for class with different type parameters', () => {
    class K<L, M> {
      l: L[][];
      m: M[];
    }

    class E<H, I> {
      h: H;
      // For ensure to resolve w/o Array<T>
      // tslint:disable-next-line: array-type
      i: K<H, I[]>[];
    }

    class A<B, C> {
      b: B;
      c: C;
    }

    expect(Randomizer.create<A<Array<E<string, number>>, object>>()).toEqual([
      {
        key: 'b',
        isArray: true,
        type: [
          { key: 'h', isArray: false, type: PropertyType.String },
          {
            key: 'i',
            isArray: true,
            type: [
              {
                key: 'l',
                isArray: true,
                type: { isArray: true, type: PropertyType.String },
              },
              {
                key: 'm',
                isArray: true,
                type: { isArray: true, type: PropertyType.Number },
              },
            ],
          },
        ],
      },
      { key: 'c', isArray: false, type: PropertyType.Object },
    ]);
  });

  test('should generate description for classes with props with type parameters', () => {
    class W<P> {
      p: P;
    }

    class I<D> {
      i: W<D[]>;
    }

    class J<G, H> {
      g: G;
      h: I<H[]>;
    }

    class A<T, V> {
      t: J<T[], V>;
    }

    expect(Randomizer.create<A<string, number>>()).toEqual([
      {
        key: 't',
        isArray: false,
        type: [
          { key: 'g', isArray: true, type: PropertyType.String },
          {
            key: 'h',
            isArray: false,
            type: [
              {
                key: 'i',
                isArray: false,
                type: [{ key: 'p', isArray: true, type: PropertyType.Number }],
              },
            ],
          },
        ],
      },
    ]);
  });
});
