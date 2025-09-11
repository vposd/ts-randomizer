import { Randomizer } from 'ts-randomizer';

describe('Randomizer with transformer', () => {
  it('should work', () => {
    interface A {
      a: string;
    }
    expect(Randomizer.create<A>()).toEqual({ a: jasmine.any(String) });
  });
});
