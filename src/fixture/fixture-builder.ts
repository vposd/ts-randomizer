import { random, isString, isArray, range, isNil } from 'lodash/fp';

import { TypeDescription, PropertyDescription, PropertyType } from '../types';
import { createString, createNumber, createBoolean, createFunction, createObject, createAny } from './util';

export class FixtureBuilder<T> {
  private readonly mutators = [];

  constructor(
    private readonly input: TypeDescription
  ) { }

  /**
   * Creates a data by the requested type.
   */
  create() {
    return this.mutators
      .reduce((out, mutator) =>
        (mutator(out), out),
        this.generate()
      );
  }

  /**
   * Creates many data by the requested type.
   */
  createMany(minCount?: number, maxCount?: number) {
    return range(minCount || 0, maxCount)
      .map(() => this.create());
  }

  /**
   * Registers a mutation handler for object prop
   * @param func Object
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
    return this.generateArrayValue(this.input);
  }

  private generatePropertiesValues(props: PropertyDescription[]) {
    return props
      .reduce((output, prop) => {
        if (!prop) {
          return output;
        }
        if (prop.isArray) {
          const count = 5;
          output[prop.key] = new FixtureBuilder(prop.type).createMany(count);
          return output;
        }
        output[prop.key] = new FixtureBuilder(prop.type).create();
        return output;
      }, {});
  }

  private generateArrayValue(description: PropertyDescription) {
    return range(random(2, 3), random(5, 7))
      .map(() => this.generateValue(description.type as PropertyType));
  }

  private generateValue(type: PropertyType) {
    switch (type) {
      case PropertyType.String: return createString();
      case PropertyType.Number: return createNumber();
      case PropertyType.Boolean: return createBoolean();
      case PropertyType.Function: return createFunction();
      case PropertyType.Object: return createObject();
      default: return createAny();
    }
  }
}
