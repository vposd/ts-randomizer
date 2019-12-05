import * as ts from 'typescript';

export type TypeArgumentsMap = { [key: string]: { type: ts.Type, isArray?: boolean } };

export enum PropertyType {
  Any = 'any',
  Boolean = 'boolean',
  Date = 'date',
  Function = 'function',
  Number = 'number',
  Object = 'object',
  String = 'string',
  Unknown = 'unknown',
}

export type TypeDescription = PropertyDescription | PropertyType | (PropertyType | PropertyDescription)[];

export interface PropertyDescription {
  key?: string;
  isArray?: boolean;
  type: TypeDescription;
}
