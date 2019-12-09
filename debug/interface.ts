import { Randomizer } from '../src/randomizer/randomizer';

class B {
  id!: string;
  value!: string;
}

class A {
  a!: B[];
}

Randomizer.create<A>();
