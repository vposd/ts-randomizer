import { Randomizer } from '../src/randomizer/randomizer';

interface B<C> {
  c: C[];
}

interface A {
  a: [number, B<boolean>];
}

Randomizer.create<[A, boolean, number]>();
