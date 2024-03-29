import { isUndefined } from 'lodash/fp';

import { SpecimenFactory } from './specimen-factory';
import { TypeDescription } from '../types';

type RandomizerArguments = [TypeDescription?];

export class Randomizer {
  /**
   * Creates anonymous variables by description of T.
   * @returns An anonymous variable of type T.
   */
  static create<T>(...args: RandomizerArguments): T | undefined {
    if (isUndefined(args[0])) {
      return undefined;
    }
    return new SpecimenFactory<T>(args[0]).create() as T;
  }

  /**
   * Creates many anonymous objects by requested type.
   * @returns A sequence of anonymous object of type T.
   */
  static createMany<T>(
    firstArg?: TypeDescription | number,
    minCount?: number,
    maxCount?: number
  ): T[] | undefined {
    if (isUndefined(firstArg)) {
      return undefined;
    }
    return new SpecimenFactory<T>(firstArg as TypeDescription).createMany(
      minCount,
      maxCount
    ) as T[];
  }

  /**
   * Returns a specimen factory
   */
  static build<T>(...args: RandomizerArguments): SpecimenFactory<T> {
    if (isUndefined(args[0])) {
      throw new Error('[Randomizer] Error: Missing type description');
    }
    return new SpecimenFactory<T>(args[0]);
  }
}
