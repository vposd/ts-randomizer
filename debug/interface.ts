class Fixture {
  static create<T>(desc?: unknown) {
    return desc;
  }
}

interface A {
  a: string;
}

Fixture.create<A[]>();
