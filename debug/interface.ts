import { Randomizer } from '../src/randomizer/randomizer';
enum Enum {
  a = '1',
}

interface A<T> {
  a: T[];
}
Randomizer.create<A<Enum>>();
