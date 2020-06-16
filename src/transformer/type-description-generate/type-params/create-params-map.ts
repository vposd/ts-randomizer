import * as ts from 'typescript';
import {flatMap} from 'lodash/fp';

import {TypeParamsMap} from '../../../types';
import {getTypeChecker} from '../../checker';
import {isArrayType, getFirstTypeParameter, getTypeArguments} from '../utils';

/**
 * Create type arguments map where key is type argument symbol name, value is concrete argument type
 * @param type Type
 */
export const createTypeParamsMap = (type: ts.Type): TypeParamsMap => {
  const checker = getTypeChecker();
  const argumentsMap: TypeParamsMap = {};
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
      return createTypeParamsMap(arrayTypeParam);
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
