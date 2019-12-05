import { isString, isArray, range, isNil } from 'lodash/fp';

import { TypeDescription, PropertyDescription, PropertyType } from '../types';
import {
  createString,
  createNumber,
  createBoolean,
  createFunction,
  createObject,
  createAny,
  createDate,
} from './util';

type Mutator<T> = (x: Value<T> | null) => unknown;
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
      (out, mutator) => (mutator(out), out),
      this.generate()
    );
  }

  /**
   * Creates many anonymous objects.
   * @returns A sequence of anonymous object of type T.
   */
  createMany(minCount = this.arrayValueCount, maxCount = this.arrayValueCount) {
    return range(minCount, maxCount).map(() => this.create());
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
    if (isString(this.input)) {
      return this.generateValue(this.input) as Value<T>;
    }
    if (isArray(this.input)) {
      return this.generatePropertiesValues(
        this.input as PropertyDescription[]
      ) as Value<T>;
    }
    return this.generatePropertyValue(this.input) as Value<T>;
  }

  private generatePropertyValue(prop: PropertyDescription): Value<T> {
    if (prop.isArray) {
      return new SpecimenFactory<keyof T>(prop.type).createMany(
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
      Reflect.set(output, prop.key, this.generatePropertyValue(prop));
      return output;
    }, {} as object);
  }

  private generateValue(type: PropertyType): BasicType {
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
        return createAny();
    }
  }
}
