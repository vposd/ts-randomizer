import * as ts from 'typescript';

import { DescriptionFactory } from './node';
import { createDescription } from './utils/create-description';
import { createTypeParamsMap } from './type-params/create-params-map';
import { getTypeChecker } from '../checker';

export const getTypeNodeDescription: DescriptionFactory<ts.TypeNode> = node => {
  const checker = getTypeChecker();
  const type = checker.getTypeFromTypeNode(node);
  const argsMap = createTypeParamsMap(type);
  return createDescription(null, type, argsMap);
};
