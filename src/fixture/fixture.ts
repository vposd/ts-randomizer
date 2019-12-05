import { FixtureBuilder } from './fixture-builder';
import { TypeDescription } from '../types';

export class Fixture {
  /**
  * Creates a data by the requested type.
  */
  static create<T>(template?: TypeDescription): T | T[] {
    return new FixtureBuilder<T>(template).create();
  }

  /**
  * Creates many data by the requested type.
  */
  static createMany<T>(firstArg?: TypeDescription | number, minCount?: number, maxCount?: number): T[] {
    return new FixtureBuilder<T>(firstArg as TypeDescription).createMany(minCount, maxCount);
  }

  /**
  * Returns a fixture builder
  * @param func Object
  */
  static build<T>(template?: TypeDescription): FixtureBuilder<T> {
    return new FixtureBuilder<T>(template);
  }
}
