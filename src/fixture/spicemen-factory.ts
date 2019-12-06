import { isString, isArray, range, isNil } from 'lodash/fp';

import { TypeDescription, PropertyDescription, PropertyType } from '../types';
import {
  createString,
  createNumber,
  createBoolean,
  createFunction,
  createObject,
  createUnknown,
  createDate,
} from './util';

type Mutator<T> = (x: T | null) => unknown;
export type BasicType = string | number | boolean | object | Date | Function;
export type Value<T> = T extends BasicType ? BasicType : T;

/**
 * Creates anonymous variables by description of T.
 */
export class SpecimenFactory<T> {
  private readonly mutators: Array<Mutator<T>> = [];
  private readonly arrayValueCount = 5;

  /**
   * @param input The description of type to create.
   */
  constructor(private readonly input: TypeDescription) {}

  /**
   * Creates an variable of the requested type.
   * @returns An anonymous variable of type T.
   */
  create() {
    return this.mutators.reduce(
      (out, mutator) => (mutator(out as T), out),
      this.generate()
    );
  }

  /**
   * Creates many anonymous objects.
   * @returns A sequence of anonymous object of type T.
   */
  createMany(minCount?: number, maxCount?: number) {
    return range(minCount || 0, maxCount || 0).map(() => this.create());
  }

  /**
   * Registers that a writable property or field should be assigned an anonymous value
   * as part of specimen post-processing.
   * @param func An expression that identifies the property or field that will should have a value assigned.
   */
  with(func: Mutator<T>) {
    this.mutators.push(func);
    return this;
  }

  private generate() {
    if (this.input === PropertyType.Undefined) {
      return undefined;
    }
    if (this.input === PropertyType.Null) {
      return null;
    }
    if (isString(this.input)) {
      return this.generateValue(this.input);
    }
    if (isArray(this.input)) {
      return this.generatePropertiesValues(this.input as PropertyDescription[]);
    }
    return this.generatePropertyValue(this.input);
  }

  private generatePropertyValue(prop: PropertyDescription): Value<T> {
    if (prop.isArray) {
      return new SpecimenFactory(prop.type).createMany(
        this.arrayValueCount
      ) as Value<T>;
    }
    return new SpecimenFactory<T>(prop.type).create() as Value<T>;
  }

  private generatePropertiesValues(props: PropertyDescription[]) {
    return props.reduce((output, prop) => {
      if (!prop || !prop.key) {
        return output;
      }
      output[prop.key] = this.generatePropertyValue(prop);
      return output;
    }, {} as { [key: string]: Value<T> });
  }

  private generateValue(type: PropertyType) {
    switch (type) {
      case PropertyType.String:
        return createString();
      case PropertyType.Number:
        return createNumber();
      case PropertyType.Boolean:
        return createBoolean();
      case PropertyType.Function:
        return createFunction();
      case PropertyType.Date:
        return createDate();
      case PropertyType.Object:
        return createObject();
      default:
        return createUnknown();
    }
  }
}
