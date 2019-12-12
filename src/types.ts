import * as ts from 'typescript';

export interface TypeParamsMap {
  [key: string]: { type: ts.Type; isArray?: boolean };
}

export enum PropertyType {
  Boolean = 'boolean',
  Date = 'date',
  Function = 'function',
  Number = 'number',
  Object = 'object',
  String = 'string',
  Unknown = 'unknown',
  Null = 'null',
  Undefined = 'undefined',
}

export type TypeDescription =
  | PropertyDescription
  | PropertyType
  | Array<PropertyType | PropertyDescription>;

export enum DescriptionFlag {
  Array,
  Turple,
  Method,
  Enum,
}

export interface PropertyDescription {
  key?: string;
  flag?: DescriptionFlag | null;
  possibleValues?: unknown | unknown[];
  description: TypeDescription;
}
