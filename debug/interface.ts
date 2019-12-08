import { Randomizer } from '../src/randomizer/randomizer';

interface A<T> {
  a: T[];
}

Randomizer.create<A<string>>();
