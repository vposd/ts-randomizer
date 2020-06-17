import ts = require('typescript');
import { isEmpty, flatMap, map } from 'lodash/fp';

import {
  TypeParamsMap,
  PropertyType,
  TypeDescription,
  DescriptionFlag,
} from '../../../types';
import { createTypeParamsMap } from '../type-params/create-params-map';
import { generateNodeDescription } from '../node';
import {
  getPropertyNameBySyntaxKind,
  getTypeNameByWrapperFunction,
  getFirstTypeParameter,
  isArrayType,
} from './index';
import { getTurpleNodeDescription } from '../turple-type-node';
import { getTypeChecker } from '../../checker';
import { mergeTypeParamsMap } from '../type-params/marge-params-map';

const getEnumValues = (type: ts.Type) =>
  map(
    literal => (literal as ts.LiteralType).value,
    (type as ts.IntersectionType).types
  );

/**
 * Generate description for type symbol declaration
 * @param node Property declarations
 * @param nodeTypeArguments Property type arguments relations map
 * @param typeArgumentsMap Parent node type arguments relations map
 */
const createDeclarationDescription = (
  node: ts.Declaration,
  nodeTypeArguments: TypeParamsMap = {},
  typeArgumentsMap: TypeParamsMap = {}
) => {
  const checker = getTypeChecker();

  if (
    !node ||
    !(
      ts.isPropertyDeclaration(node) ||
      ts.isPropertySignature(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isMethodSignature(node)
    )
  ) {
    return PropertyType.Unknown;
  }

  if (!node.type) {
    const key = node.name.getText();
    return {
      key,
      description: PropertyType.Unknown,
    };
  }

  if (ts.isTupleTypeNode(node.type)) {
    return getTurpleNodeDescription(node.type);
  }

  const nodeTypeNode = ts.isArrayTypeNode(node.type)
    ? node.type.elementType
    : node.type;

  const nodeType = checker.getTypeFromTypeNode(nodeTypeNode);
  const argumentsMap = createTypeParamsMap(nodeType);

  return generateNodeDescription(
    node,
    mergeTypeParamsMap(argumentsMap, nodeTypeArguments, typeArgumentsMap)
  );
};

/**
 * Generate property description
 * @param key Property key
 * @param type Type for description generation
 * @param typeArgumentsMap Node type arguments relations
 */
export const createDescription = (
  key: string | null,
  type: ts.Type,
  typeArgumentsMap: TypeParamsMap = {}
): TypeDescription => {
  const checker = getTypeChecker();
  if (!type) {
    return PropertyType.Unknown;
  }

  if (!type.symbol) {
    const typeNode = checker.typeToTypeNode(type);
    return getPropertyNameBySyntaxKind(typeNode);
  }

  const nameByWrapper = getTypeNameByWrapperFunction(type.symbol.name);

  if (nameByWrapper) {
    return nameByWrapper;
  }

  const arrayTypeParam = getFirstTypeParameter(type);
  if (isArrayType(type) && arrayTypeParam) {
    return {
      flag: DescriptionFlag.Array,
      description: createDescription(key, arrayTypeParam, typeArgumentsMap),
    };
  }

  const enumValues = getEnumValues(type);

  if (!isEmpty(enumValues)) {
    return {
      flag: DescriptionFlag.Enum,
      possibleValues: enumValues,
      description: [],
    };
  }

  const declarations = flatMap(
    p => p.declarations,
    checker.getPropertiesOfType(type)
  );

  if (!declarations.length) {
    const typeArg = typeArgumentsMap[type.symbol.name];
    const isArray = typeArg && typeArg.isArray;
    if (isArray) {
      return {
        flag: DescriptionFlag.Array,
        description: createDescription(
          key,
          typeArg && typeArg.type,
          typeArgumentsMap
        ),
      };
    }
    return createDescription(key, typeArg && typeArg.type, typeArgumentsMap);
  }

  const nodeTypeArguments = createTypeParamsMap(type);
  return flatMap(
    node =>
      createDeclarationDescription(node, nodeTypeArguments, typeArgumentsMap),
    declarations
  );
};
