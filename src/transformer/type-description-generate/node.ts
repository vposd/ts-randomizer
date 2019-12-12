import * as ts from 'typescript';

import { TypeParamsMap, TypeDescription, PropertyType } from '../../types';
import { getArrayTypeDescription } from './array-type-node';
import { getTurpleNodeDescription } from './turple-type-node';
import { getTypeNodeDescription } from './type-node';
import { getPropertyDescription } from './property-signature-declaration';
import { getMethodDescription } from './method-signature-declaration';

export type DescriptionFactory<T> = (
  node: T,
  typeArgumentsMap?: TypeParamsMap
) => TypeDescription;

/**
 * Generates description for node type
 * @param node Target node
 * @param typeArgumentsMap Node type arguments relations
 */
export const generateNodeDescription: DescriptionFactory<ts.Node> = (
  node,
  typeArgumentsMap = {}
) => {
  // Return description for array type node
  if (ts.isArrayTypeNode(node)) {
    return getArrayTypeDescription(node, typeArgumentsMap);
  }

  // Return description for turple type node
  if (ts.isTupleTypeNode(node)) {
    return getTurpleNodeDescription(node);
  }

  // Return description for type node
  if (ts.isTypeNode(node)) {
    return getTypeNodeDescription(node);
  }

  // Return property declaration
  if (ts.isPropertyDeclaration(node) || ts.isPropertySignature(node)) {
    return getPropertyDescription(node, typeArgumentsMap);
  }

  // Return method description
  if (ts.isMethodSignature(node) || ts.isMethodDeclaration(node)) {
    return getMethodDescription(node, typeArgumentsMap);
  }

  return PropertyType.Null;
};
