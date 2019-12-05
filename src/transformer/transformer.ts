import * as ts from 'typescript';
import { isArray, isEmpty, flatMap } from 'lodash/fp';

import { TypeArgumentsMap, PropertyType, TypeDescription } from '../types';
import {
  isArrayType,
  getFirstTypeParameter,
  getTypeArguments,
  getPropertyNameBySyntaxKind,
  getTypeNameByWrapperFunction,
  isTargetExpression,
} from './utils';

/**
 * Typescript transformer factory
 * @param program Program
 */
export const transformer = (
  program: ts.Program
): ts.TransformerFactory<ts.SourceFile> => (
  context: ts.TransformationContext
) => (file: ts.SourceFile) =>
  ts.visitNode(file, visitNode(context, program.getTypeChecker()));

/**
 * Create type arguments map where key is type argument symbol name, value is concrete argument type
 * @param type Type
 */
const createTypeArgumentsMap = (type: ts.Type) => (
  checker: ts.TypeChecker
): TypeArgumentsMap => {
  const argumentsMap = {};
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
    const typeDesc = {
      type: isArray ? getFirstTypeParameter(item) : item,
      isArray,
    };
    if (!itemSymbol) {
      return acc;
    }
    Reflect.set(acc, itemSymbol.name, typeDesc);
    return acc;
  }, argumentsMap);
};

/**
 * Generate description for array type argument
 * @param node Node
 * @param symbol Node symbol
 * @param typeArgumentsMap Node type arguments relations map
 */
const generateArrayTypeArgumentDescription = (
  node: ts.Node,
  symbol: ts.Symbol,
  typeArgumentsMap: TypeArgumentsMap = {}
) => (checker: ts.TypeChecker) => {
  const type = checker.getTypeAtLocation(node);
  const isArray = type.symbol
    ? typeArgumentsMap[type.symbol.name] &&
      typeArgumentsMap[type.symbol.name].isArray
    : false;

  if (!isArray) {
    return;
  }

  return {
    key: symbol.getName(),
    isArray,
    type: generatePropertyDescription(
      symbol.getName(),
      typeArgumentsMap[type.symbol.name].type,
      typeArgumentsMap
    )(checker),
  };
};

/**
 * Generate description for property declaration
 * @param node Property declarations
 * @param nodeTypeArguments Property type arguments relations map
 * @param typeArgumentsMap Parent node type arguments relations map
 */
const resolvePropertyDeclaration = (
  node: ts.PropertyDeclaration,
  nodeTypeArguments: TypeArgumentsMap = {},
  typeArgumentsMap: TypeArgumentsMap = {}
) => (checker: ts.TypeChecker) => {
  if (!node || !node.type) {
    return PropertyType.Unknown;
  }
  const nodeTypeNode = ts.isArrayTypeNode(node.type)
    ? node.type.elementType
    : node.type;

  const nodeType = checker.getTypeFromTypeNode(nodeTypeNode);
  const argumentsMap = createTypeArgumentsMap(nodeType)(checker);

  const newArgumentsMap = isEmpty(argumentsMap)
    ? isEmpty(nodeTypeArguments) ||
      Object.keys(nodeTypeArguments).some(k => typeArgumentsMap[k])
      ? typeArgumentsMap
      : nodeTypeArguments
    : argumentsMap;

  Object.keys(newArgumentsMap).forEach(key => {
    const item = newArgumentsMap[key];
    const symbol = item.type.getSymbol();
    if (!symbol) {
      return;
    }
    const found =
      typeArgumentsMap[symbol.name] || nodeTypeArguments[symbol.name];
    if (found) {
      newArgumentsMap[key] = {
        isArray: item.isArray || found.isArray,
        type: found.type,
      };
      return;
    }
    getTypeArguments(item.type).forEach(i => {
      if (!i.symbol) {
        return;
      }
      const arr = getFirstTypeParameter(i);
      const symbolName = isArrayType(i)
        ? arr
          ? arr.symbol && arr.symbol.name
          : i.symbol.name
        : null;
      if (!symbolName) {
        return;
      }
      newArgumentsMap[symbolName] =
        typeArgumentsMap[symbolName] ||
        nodeTypeArguments[symbolName] ||
        newArgumentsMap[symbolName];
    });
  });

  return generateNodeDescription(node, newArgumentsMap)(checker);
};

/**
 * Generate property description
 * @param key Property key
 * @param type Type for description generation
 * @param typeArgumentsMap Node type arguments relations
 */
const generatePropertyDescription = (
  key: string | null,
  type: ts.Type,
  typeArgumentsMap: TypeArgumentsMap = {}
) => (checker: ts.TypeChecker): TypeDescription => {
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
      isArray: true,
      type: generatePropertyDescription(
        key,
        arrayTypeParam,
        typeArgumentsMap
      )(checker),
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
        isArray,
        type: generatePropertyDescription(
          key,
          typeArg && typeArg.type,
          typeArgumentsMap
        )(checker),
      };
    }
    return generatePropertyDescription(
      key,
      typeArg && typeArg.type,
      typeArgumentsMap
    )(checker);
  }

  const nodeTypeArguments = createTypeArgumentsMap(type)(checker);
  return flatMap(
    node =>
      resolvePropertyDeclaration(
        node as ts.PropertyDeclaration,
        nodeTypeArguments,
        typeArgumentsMap
      )(checker),
    declarations
  );
};

/**
 * Generates description for node type
 * @param node Target node
 * @param typeArgumentsMap Node type arguments relations
 */
const generateNodeDescription = (
  node: ts.Node,
  typeArgumentsMap: TypeArgumentsMap = {}
) => (checker: ts.TypeChecker): TypeDescription => {
  // Return description for array type node
  if (ts.isArrayTypeNode(node)) {
    if (ts.isArrayTypeNode(node.elementType)) {
      return {
        isArray: true,
        type: generateNodeDescription(
          node.elementType,
          typeArgumentsMap
        )(checker),
      };
    }

    const type = checker.getTypeFromTypeNode(node.elementType);
    if (isEmpty(typeArgumentsMap)) {
      return {
        isArray: true,
        type: generatePropertyDescription(
          null,
          type,
          typeArgumentsMap
        )(checker),
      };
    }
    return generatePropertyDescription(null, type, typeArgumentsMap)(checker);
  }

  // Return description for type node
  if (ts.isTypeNode(node)) {
    const type = checker.getTypeFromTypeNode(node);
    const argsMap = createTypeArgumentsMap(type)(checker);
    return generatePropertyDescription(null, type, argsMap)(checker);
  }

  // Return property declaration and array of properties declarations description
  if (ts.isPropertyDeclaration(node)) {
    if (!node || !node.type) {
      return PropertyType.Null;
    }
    if (ts.isArrayTypeNode(node.type)) {
      const symbol = checker.getSymbolAtLocation(node.name);
      return {
        key: symbol ? symbol.getName() : '',
        isArray: true,
        type: generateNodeDescription(node.type, typeArgumentsMap)(checker),
      };
    }
    const symbol = checker.getSymbolAtLocation(node.name);
    const type = checker.getTypeAtLocation(node);

    if (!symbol) {
      return PropertyType.Null;
    }

    return (
      generateArrayTypeArgumentDescription(
        node,
        symbol,
        typeArgumentsMap
      )(checker) || {
        key: symbol.getName(),
        isArray: ts.isArrayTypeNode(node.type),
        type: generatePropertyDescription(
          symbol.getName(),
          type,
          typeArgumentsMap
        )(checker),
      }
    );
  }

  // Then we need property signatures
  if (!ts.isPropertySignature(node)) {
    return PropertyType.Null;
  }

  const symbol = checker.getSymbolAtLocation(node.name);

  if (!symbol || !node.type) {
    return PropertyType.Null;
  }

  // Return description with type node description
  if (ts.isTypeReferenceNode(node.type)) {
    const type = checker.getTypeAtLocation(node);
    return (
      generateArrayTypeArgumentDescription(
        node,
        symbol,
        typeArgumentsMap
      )(checker) || {
        key: symbol.getName(),
        isArray: ts.isArrayTypeNode(node.type),
        type: generatePropertyDescription(
          symbol.getName(),
          type,
          typeArgumentsMap
        )(checker),
      }
    );
  }

  // Return description for node if its name is array
  if (ts.isArrayTypeNode(node.type)) {
    const type = checker.getTypeAtLocation(node.type.elementType);
    if (ts.isArrayTypeNode(node.type.elementType)) {
      return {
        key: symbol.getName(),
        isArray: true,
        type: generateNodeDescription(node.type, typeArgumentsMap)(checker),
      };
    }
    return {
      key: symbol.getName(),
      isArray: true,
      type: generatePropertyDescription(
        symbol.getName(),
        type,
        typeArgumentsMap
      )(checker),
    };
  }

  // Return basic type description
  return {
    key: symbol.getName(),
    isArray: ts.isArrayTypeNode(node.type),
    type: getPropertyNameBySyntaxKind(node),
  };
};

/**
 * Typescript AST Node visitor
 * @param context Transformation context
 * @param checker Type checker
 */
const visitNode = (
  context: ts.TransformationContext,
  checker: ts.TypeChecker
): ts.Visitor => node => {
  node = ts.visitEachChild(node, visitNode(context, checker), context);

  if (
    !ts.isCallExpression(node) ||
    !isTargetExpression(node) ||
    !node.typeArguments
  ) {
    return node;
  }

  if (!node.typeArguments) {
    return node;
  }

  const [typeArgument] = node.typeArguments;
  const typeTemplate = generateNodeDescription(typeArgument)(checker);
  const template = isArray(typeTemplate)
    ? ts.createArrayLiteral(
        typeTemplate.map(property =>
          ts.createRegularExpressionLiteral(JSON.stringify(property))
        )
      )
    : ts.createRegularExpressionLiteral(JSON.stringify(typeTemplate));

  return ts.updateCall(node, node.expression, node.typeArguments, [
    template,
    ...node.arguments,
  ]);
};
