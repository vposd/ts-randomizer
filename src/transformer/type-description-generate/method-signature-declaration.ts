import * as ts from 'typescript';

import {DescriptionFactory} from './node';
import {getTypeChecker} from '../checker';
import {PropertyType, DescriptionFlag} from '../../types';
import {createDescription} from './utils/create-description';

export const getMethodDescription: DescriptionFactory<
  ts.MethodSignature | ts.MethodDeclaration
> = (node, typeArgumentsMap = {}) => {
  const checker = getTypeChecker();
  const symbol = checker.getSymbolAtLocation(node.name);

  if (!symbol || !node.type) {
    return PropertyType.Null;
  }

  const type = checker.getTypeAtLocation(node.type as ts.TypeNode);
  return {
    key: symbol.getName(),
    flag: DescriptionFlag.Method,
    description: createDescription(symbol.getName(), type, typeArgumentsMap),
  };
};
