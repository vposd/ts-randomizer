import { Fixture } from './fixture';
interface A<T, V> {
  t: T;
  v: V
}

interface U<T> {
  c: T
}

interface C<Y> {
  b: number;
  y: Y[];
}

interface D {
  d: U<string>;
  a: C<U<boolean>>[];
}
Fixture.create<A<number, D>>()
