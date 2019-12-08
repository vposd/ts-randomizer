import { PropertyType, DescriptionFlag } from '../src/types';

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
      flag: DescriptionFlag.Array,
      description: PropertyType.String,
    });
    expect(Randomizer.create<number[][][]>()).toMatchObject({
      flag: DescriptionFlag.Array,
      description: {
        flag: DescriptionFlag.Array,
        description: {
          flag: DescriptionFlag.Array,
          description: PropertyType.Number,
        },
      },
    });
    expect(Randomizer.create<boolean[]>()).toMatchObject({
      flag: DescriptionFlag.Array,
      description: PropertyType.Boolean,
    });
    expect(Randomizer.create<Function[]>()).toMatchObject({
      flag: DescriptionFlag.Array,
      description: PropertyType.Function,
    });
    expect(Randomizer.create<Date[]>()).toMatchObject({
      flag: DescriptionFlag.Array,
      description: PropertyType.Date,
    });
    expect(Randomizer.create<object[]>()).toMatchObject({
      flag: DescriptionFlag.Array,
      description: PropertyType.Object,
    });
    expect(Randomizer.create<null[]>()).toMatchObject({
      flag: DescriptionFlag.Array,
      description: PropertyType.Null,
    });
  });

  test('should generate description for interface', () => {
    interface A {
      a: string;
    }

    expect(Randomizer.create<A>()).toMatchObject([
      { key: 'a', description: PropertyType.String },
    ]);
  });

  test('should generate description for class', () => {
    class A {
      a!: string;
    }

    expect(Randomizer.create<A>()).toMatchObject([
      { key: 'a', description: PropertyType.String },
    ]);
  });

  test('should generate description for turples', () => {
    interface B<C> {
      c: C[];
    }

    interface A {
      a: [number, B<boolean>];
    }

    expect(Randomizer.create<[A, boolean, number]>()).toMatchObject({
      flag: DescriptionFlag.Turple,
      description: [
        {
          description: [
            {
              flag: DescriptionFlag.Turple,
              description: [
                { description: PropertyType.Number },
                {
                  description: [
                    {
                      key: 'c',
                      flag: DescriptionFlag.Array,
                      description: PropertyType.Boolean,
                    },
                  ],
                },
              ],
            },
          ],
        },
        { description: PropertyType.Boolean },
        { description: PropertyType.Number },
      ],
    });
  });

  test('should generate description for class which extends other class', () => {
    class C {
      c!: string;
    }

    class B extends C {}

    interface A<T extends B> {
      a: T;
    }

    expect(Randomizer.create<A<B>>()).toMatchObject([
      {
        key: 'a',
        description: [{ key: 'c', description: PropertyType.String }],
      },
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
      { key: 'b', description: PropertyType.String },
      {
        key: 'c',
        flag: DescriptionFlag.Array,
        description: PropertyType.Number,
      },
      {
        key: 'd',
        flag: DescriptionFlag.Array,
        description: {
          flag: DescriptionFlag.Array,
          description: PropertyType.Boolean,
        },
      },
      {
        key: 'f',
        flag: DescriptionFlag.Array,
        description: {
          flag: DescriptionFlag.Array,
          description: {
            flag: DescriptionFlag.Array,
            description: {
              flag: DescriptionFlag.Array,
              description: PropertyType.Object,
            },
          },
        },
      },
    ]);
  });

  test('should generate description for class with different type parameters', () => {
    class A<B, C, D, F> {
      b!: B;
      c!: C;
      d!: D[];
      f!: F[][];
    }

    expect(
      Randomizer.create<A<string, number[], boolean[], object[][]>>()
    ).toMatchObject([
      { key: 'b', description: PropertyType.String },
      {
        key: 'c',
        flag: DescriptionFlag.Array,
        description: PropertyType.Number,
      },
      {
        key: 'd',
        flag: DescriptionFlag.Array,
        description: {
          flag: DescriptionFlag.Array,
          description: PropertyType.Boolean,
        },
      },
      {
        key: 'f',
        flag: DescriptionFlag.Array,
        description: {
          flag: DescriptionFlag.Array,
          description: {
            flag: DescriptionFlag.Array,
            description: {
              flag: DescriptionFlag.Array,
              description: PropertyType.Object,
            },
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
        description: [
          {
            key: 'b',
            description: [{ key: 'c', description: PropertyType.String }],
          },
        ],
      },
    ]);
  });

  test('should generate description for class with high order type parameters', () => {
    class C<M> {
      c!: M;
    }

    class B<T> {
      b!: T;
    }

    class A<Y> {
      a!: Y;
    }

    expect(Randomizer.create<A<B<C<boolean>>>>()).toMatchObject([
      {
        key: 'a',
        description: [
          {
            key: 'b',
            description: [{ key: 'c', description: PropertyType.Boolean }],
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
        flag: null,
        description: [
          {
            key: 'g',
            flag: null,
            description: [
              {
                key: 'n',
                flag: DescriptionFlag.Array,
                description: PropertyType.String,
              },
            ],
          },
        ],
      },
    ]);
  });

  test('should generate description for class with high order props type params', () => {
    class C<N> {
      n!: N;
    }
    class B<G> {
      g!: G;
    }

    class A<T> {
      a!: B<C<T>>;
    }

    expect(Randomizer.create<A<string[]>>()).toEqual([
      {
        key: 'a',
        flag: null,
        description: [
          {
            key: 'g',
            flag: null,
            description: [
              {
                key: 'n',
                flag: DescriptionFlag.Array,
                description: PropertyType.String,
              },
            ],
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
        flag: null,
        description: [
          {
            key: 'g',
            flag: DescriptionFlag.Array,
            description: [
              {
                key: 'n',
                flag: DescriptionFlag.Array,
                description: {
                  flag: DescriptionFlag.Array,
                  description: PropertyType.String,
                },
              },
              { key: 'd', flag: null, description: PropertyType.Boolean },
            ],
          },
        ],
      },
    ]);
  });

  test('should generate description for class with high order props array type params', () => {
    class C<N, D> {
      n!: N[];
      d!: D;
    }
    class B<G> {
      g!: G[];
    }

    class A<T, R> {
      a!: B<C<T[], R>>;
    }

    expect(Randomizer.create<A<string[], boolean>>()).toEqual([
      {
        key: 'a',
        flag: null,
        description: [
          {
            key: 'g',
            flag: DescriptionFlag.Array,
            description: [
              {
                key: 'n',
                flag: DescriptionFlag.Array,
                description: {
                  flag: DescriptionFlag.Array,
                  description: PropertyType.String,
                },
              },
              { key: 'd', flag: null, description: PropertyType.Boolean },
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
        flag: DescriptionFlag.Array,
        description: [
          { key: 'h', flag: null, description: PropertyType.String },
          {
            key: 'i',
            flag: DescriptionFlag.Array,
            description: [
              {
                key: 'l',
                flag: DescriptionFlag.Array,
                description: {
                  flag: DescriptionFlag.Array,
                  description: PropertyType.String,
                },
              },
              {
                key: 'm',
                flag: DescriptionFlag.Array,
                description: {
                  flag: DescriptionFlag.Array,
                  description: PropertyType.Number,
                },
              },
            ],
          },
        ],
      },
      { key: 'c', flag: null, description: PropertyType.Object },
    ]);
  });

  test('should generate description for class with different type parameters', () => {
    class K<L, M> {
      l!: L[][];
      m!: M[];
    }

    class E<H, I> {
      h!: H;
      // For ensure to resolve w/o Array<T>
      // tslint:disable-next-line: array-type
      i!: K<H, I[]>[];
    }

    class A<B, C> {
      b!: B;
      c!: C;
    }

    expect(Randomizer.create<A<Array<E<string, number>>, object>>()).toEqual([
      {
        key: 'b',
        flag: DescriptionFlag.Array,
        description: [
          { key: 'h', flag: null, description: PropertyType.String },
          {
            key: 'i',
            flag: DescriptionFlag.Array,
            description: [
              {
                key: 'l',
                flag: DescriptionFlag.Array,
                description: {
                  flag: DescriptionFlag.Array,
                  description: PropertyType.String,
                },
              },
              {
                key: 'm',
                flag: DescriptionFlag.Array,
                description: {
                  flag: DescriptionFlag.Array,
                  description: PropertyType.Number,
                },
              },
            ],
          },
        ],
      },
      { key: 'c', flag: null, description: PropertyType.Object },
    ]);
  });

  test('should generate description for classes with props with type parameters', () => {
    class W<P> {
      p!: P;
    }

    class I<D> {
      i!: W<D[]>;
    }

    class J<G, H> {
      g!: G;
      h!: I<H[]>;
    }

    class A<T, V> {
      t!: J<T[], V>;
    }

    expect(Randomizer.create<A<string, number>>()).toEqual([
      {
        key: 't',
        flag: null,
        description: [
          {
            key: 'g',
            flag: DescriptionFlag.Array,
            description: PropertyType.String,
          },
          {
            key: 'h',
            flag: null,
            description: [
              {
                key: 'i',
                flag: null,
                description: [
                  {
                    key: 'p',
                    flag: DescriptionFlag.Array,
                    description: PropertyType.Number,
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});
