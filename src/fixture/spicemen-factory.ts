import { isString, isArray, range, isNil } from 'lodash/fp';

import { TypeDescription, PropertyDescription, PropertyType } from '../types';
import { createString, createNumber, createBoolean, createFunction, createObject, createAny, createDate } from './util';

/**
 * Creates anonymous variables by description of T.
 */
export class SpecimenFactory<T> {
  private readonly mutators = [];
  private readonly arrayValueCount = 5;

  /**
   * @param input The description of type to create.
   */
  constructor(
    private readonly input: TypeDescription
  ) { }

  /**
   * Creates an variable of the requested type.
   * @returns An anonymous variable of type T.
   */
  create() {
    return this.mutators
      .reduce((out, mutator) =>
        (mutator(out), out),
        this.generate()
      );
  }

  /**
   * Creates many anonymous objects.
   * @returns A sequence of anonymous object of type T.
   */
  createMany(minCount?: number, maxCount?: number) {
    return range(minCount || 0, maxCount)
      .map(() => this.create());
  }

  /**
   * Registers that a writable property or field should be assigned an anonymous value
   * as part of specimen post-processing.
   * @param func An expression that identifies the property or field that will should have a value assigned.
   */
  with(func: (x: T) => any) {
    this.mutators.push(func);
    return this;
  }

  private generate() {
    if (isNil(this.input)) {
      return this.input;
    }
    if (isString(this.input)) {
      return this.generateValue(this.input);
    }
    if (isArray(this.input)) {
      return this.generatePropertiesValues(this.input as PropertyDescription[]);
    }
    return this.generatePropertyValue(this.input);
  }

  private generatePropertyValue(prop: PropertyDescription) {
    if (prop.isArray) {
      return new SpecimenFactory(prop.type).createMany(this.arrayValueCount);
    }
    return new SpecimenFactory(prop.type).create();
  }

  private generatePropertiesValues(props: PropertyDescription[]) {
    return props
      .reduce((output, prop) => {
        if (!prop) {
          return output;
        }
        output[prop.key] = this.generatePropertyValue(prop);
        return output;
      }, {});
  }

  private generateValue(type: PropertyType) {
    switch (type) {
      case PropertyType.String: return createString();
      case PropertyType.Number: return createNumber();
      case PropertyType.Boolean: return createBoolean();
      case PropertyType.Function: return createFunction();
      case PropertyType.Date: return createDate();
      case PropertyType.Object: return createObject();
      default: return createAny();
    }
  }
}
