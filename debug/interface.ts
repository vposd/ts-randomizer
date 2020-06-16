import {Randomizer} from '../src/randomizer/randomizer';

interface A<T> {
  a(): T;
  b(): string;
}

Randomizer.create<A<string>>();
