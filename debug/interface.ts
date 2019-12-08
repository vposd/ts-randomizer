import { Randomizer } from '../src/randomizer/randomizer';
interface B<C, D> {
  c: C[];
  d: string;
}
class A<T> {
  a!: B<T, boolean>;
}
Randomizer.create<A<string>>();
