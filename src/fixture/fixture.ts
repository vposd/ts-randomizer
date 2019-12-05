import { SpecimenFactory } from './spicemen-factory';
import { TypeDescription } from '../types';

export class Fixture {
  /**
   * Creates anonymous variables by description of T.
   * @returns An anonymous variable of type T.
   */
  static create<T>(...args: any): T | T[] {
    return new SpecimenFactory<T>(args[0]).create();
  }

  /**
   * Creates many anonymous objects by requested type.
   * @returns A sequence of anonymous object of type T.
   */
  static createMany<T>(firstArg?: TypeDescription | number, minCount?: number, maxCount?: number): T[] {
    return new SpecimenFactory<T>(firstArg as TypeDescription).createMany(minCount, maxCount);
  }

  /**
  * Returns a spicemen factory
  * @param template A Type description that describes what to create.
  */
  static build<T>(template?: TypeDescription): SpecimenFactory<T> {
    return new SpecimenFactory<T>(template);
  }
}
