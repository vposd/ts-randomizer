import * as ts from 'typescript';

import {DescriptionFactory, generateNodeDescription} from './node';
import {TypeParamsMap, DescriptionFlag, PropertyType} from '../../types';
import {createDescription} from './utils/create-description';
import {getTypeChecker} from '../checker';
import {
  isArrayType,
  getFirstTypeParameter,
  getPropertyNameBySyntaxKind,
} from './utils';

/**
 * Generate description for array type argument
 * @param node Node
 * @param symbol Node symbol
 * @param typeArgumentsMap Node type arguments relations map
 */
const generateArrayTypeArgumentDescription = (
  node: ts.Node,
  symbol: ts.Symbol,
  typeArgumentsMap: TypeParamsMap = {}
) => {
  const checker = getTypeChecker();
  const type = checker.getTypeAtLocation(node);
  const isArrayNode = isArrayType(type);
  const isTypeArray = type.symbol
    ? typeArgumentsMap[type.symbol.name] &&
      typeArgumentsMap[type.symbol.name].isArray
    : false;
  const isArray = isArrayNode || isTypeArray;

  if (!isArray) {
    return;
  }

  const argumentType = isArrayNode
    ? getFirstTypeParameter(type)
    : typeArgumentsMap[type.symbol.name].type;

  return {
    key: symbol.getName(),
    flag: isArray ? DescriptionFlag.Array : null,
    description: createDescription(
      symbol.getName(),
      argumentType || typeArgumentsMap[type.symbol.name].type,
      typeArgumentsMap
    ),
  };
};

export const getPropertyDescription: DescriptionFactory<
  ts.PropertySignature | ts.PropertyDeclaration
> = (node, typeArgumentsMap = {}) => {
  const checker = getTypeChecker();
  const symbol = checker.getSymbolAtLocation(node.name);

  if (!symbol || !node.type) {
    return PropertyType.Null;
  }

  // Return description with type node description
  if (ts.isTypeReferenceNode(node.type)) {
    const type = checker.getTypeAtLocation(node);
    return (
      generateArrayTypeArgumentDescription(node, symbol, typeArgumentsMap) || {
        key: symbol.getName(),
        flag: ts.isArrayTypeNode(node.type) ? DescriptionFlag.Array : null,
        description: createDescription(
          symbol.getName(),
          type,
          typeArgumentsMap
        ),
      }
    );
  }

  // Return description for node if its name is array
  if (ts.isArrayTypeNode(node.type)) {
    const type = checker.getTypeAtLocation(node.type.elementType);
    if (ts.isArrayTypeNode(node.type.elementType)) {
      return {
        key: symbol.getName(),
        flag: DescriptionFlag.Array,
        description: generateNodeDescription(node.type, typeArgumentsMap),
      };
    }
    return {
      key: symbol.getName(),
      flag: DescriptionFlag.Array,
      description: createDescription(symbol.getName(), type, typeArgumentsMap),
    };
  }

  // Return basic type description
  return {
    key: symbol.getName(),
    description: getPropertyNameBySyntaxKind(node),
  };
};
