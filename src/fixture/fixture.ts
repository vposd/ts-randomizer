import { FixtureBuilder } from './fixture-builder';
import { TypeDescription } from '../types';

export class Fixture {
  static create<T>(template?: TypeDescription): T | T[] {
    return new FixtureBuilder<T>(template).create();
  }

  static createMany<T>(firstArg?: TypeDescription | number, minCount?: number, maxCount?: number): T[] {
    return new FixtureBuilder<T>(firstArg as TypeDescription).createMany(minCount, maxCount);
  }

  static build<T>(template?: TypeDescription): FixtureBuilder<T> {
    return new FixtureBuilder<T>(template);
  }
}
