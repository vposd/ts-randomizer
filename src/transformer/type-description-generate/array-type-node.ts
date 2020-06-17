import * as ts from 'typescript';
import { isEmpty } from 'lodash/fp';

import { DescriptionFactory, generateNodeDescription } from './node';
import { DescriptionFlag } from '../../types';
import { createDescription } from './utils/create-description';
import { getTypeChecker } from '../checker';

export const getArrayTypeDescription: DescriptionFactory<ts.ArrayTypeNode> = (
  node,
  typeArgumentsMap = {}
) => {
  const checker = getTypeChecker();

  if (ts.isArrayTypeNode(node.elementType)) {
    return {
      flag: DescriptionFlag.Array,
      description: generateNodeDescription(node.elementType, typeArgumentsMap),
    };
  }

  const type = checker.getTypeFromTypeNode(node.elementType);
  if (isEmpty(typeArgumentsMap)) {
    return {
      flag: DescriptionFlag.Array,
      description: createDescription(null, type, typeArgumentsMap),
    };
  }
  return createDescription(null, type, typeArgumentsMap);
};
