class Randomizer {
  static create<T>(desc?: unknown) {
    return desc;
  }
}

interface A {
  a: string;
}

Randomizer.create<A[]>();
