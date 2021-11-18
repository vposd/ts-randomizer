import * as ts from 'typescript';
import { first } from 'lodash/fp';

import { PropertyType } from '../../../types';

export const getTypeNameByWrapperFunction = (name: string) => {
  switch (name) {
    case 'Number':
      return PropertyType.Number;
    case 'String':
      return PropertyType.String;
    case 'Boolean':
      return PropertyType.Boolean;
    case 'Date':
      return PropertyType.Date;
    case 'Function':
      return PropertyType.Function;
    case 'Object':
      return PropertyType.Object;
    default:
      return null;
  }
};

export const getPropertyNameBySyntaxKind = (
  propertySignature:
    | ts.PropertySignature
    | ts.PropertyDeclaration
    | ts.TypeNode
    | undefined
): PropertyType => {
  if (!propertySignature) {
    return PropertyType.Unknown;
  }
  let kind: ts.SyntaxKind | undefined = propertySignature.kind;
  if (ts.isLiteralTypeNode(propertySignature)) {
    kind = propertySignature.literal.kind;
  }
  if (
    ts.isPropertyDeclaration(propertySignature) ||
    ts.isPropertySignature(propertySignature)
  ) {
    kind = propertySignature.type && propertySignature.type.kind;
  }
  switch (kind) {
    case ts.SyntaxKind.StringKeyword:
      return PropertyType.String;
    case ts.SyntaxKind.NumberKeyword:
      return PropertyType.Number;
    case ts.SyntaxKind.BooleanKeyword:
      return PropertyType.Boolean;
    case ts.SyntaxKind.FunctionKeyword:
      return PropertyType.Function;
    case ts.SyntaxKind.ObjectKeyword:
      return PropertyType.Object;
    case ts.SyntaxKind.NullKeyword:
      return PropertyType.Null;
    case ts.SyntaxKind.UndefinedKeyword:
      return PropertyType.Undefined;
    case ts.SyntaxKind.ArrayType:
      return ts.isPropertyDeclaration(propertySignature) ||
        ts.isPropertySignature(propertySignature)
        ? getPropertyNameBySyntaxKind(
            (propertySignature.type as ts.ArrayTypeNode).elementType
          )
        : getPropertyNameBySyntaxKind(
            (propertySignature as ts.ArrayTypeNode).elementType
          );
    default:
      return PropertyType.Unknown;
  }
};

export const getTypeArguments = (type: ts.Type | ts.TypeNode) =>
  (type as ts.TypeReference).typeArguments || [];

export const getFirstTypeParameter = (item: ts.Type | ts.TypeNode) =>
  first(getTypeArguments(item));

export const isArrayType = (type: ts.Type) =>
  type.symbol && type.symbol.name === 'Array';
