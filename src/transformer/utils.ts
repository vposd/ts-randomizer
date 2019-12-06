import * as ts from 'typescript';
import { first, flatMap } from 'lodash/fp';

import { PropertyType, TypeArgumentsMap } from '../types';

const TARGET_CALLERS = ['create', 'createMany', 'build'];
const TARGET_CLASS_NAME = 'Randomizer';

/**
 * Create type arguments map where key is type argument symbol name, value is concrete argument type
 * @param type Type
 */
export const createTypeArgumentsMap = (type: ts.Type) => (
  checker: ts.TypeChecker
): TypeArgumentsMap => {
  const argumentsMap: TypeArgumentsMap = {};
  const symbol = type.getSymbol();

  if (!symbol) {
    return argumentsMap;
  }

  const typeParameters = flatMap(
    d =>
      ts.isInterfaceDeclaration(d) || ts.isClassDeclaration(d)
        ? d.typeParameters
        : [],
    symbol.declarations
  );

  if (isArrayType(type)) {
    const arrayTypeParam = getFirstTypeParameter(type);
    if (arrayTypeParam) {
      return createTypeArgumentsMap(arrayTypeParam)(checker);
    }
  }

  return getTypeArguments(type).reduce((acc, item, index) => {
    const typeParameterItem = typeParameters[index];
    if (!typeParameterItem) {
      return acc;
    }
    const itemSymbol = checker.getTypeAtLocation(typeParameterItem).getSymbol();
    const isArray = isArrayType(item);
    const type = isArray ? getFirstTypeParameter(item) : item;
    if (!type) {
      return acc;
    }
    if (itemSymbol) {
      acc[itemSymbol.name] = {
        type,
        isArray,
      };
    }
    return acc;
  }, argumentsMap);
};

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

export const isTargetExpression = (target: ts.CallExpression) =>
  ts.isPropertyAccessExpression(target.expression) &&
  ts.isIdentifier(target.expression.expression) &&
  TARGET_CALLERS.includes(target.expression.name.text) &&
  target.expression.expression.text === TARGET_CLASS_NAME;
