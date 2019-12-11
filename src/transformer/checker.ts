import * as ts from 'typescript';

let _checker: ts.TypeChecker;

export const setTypeChecker = (checker: ts.TypeChecker) => (_checker = checker);

export const getTypeChecker = () => {
  if (!_checker) {
    throw new Error('[Description transformer] Missing type checker');
  }
  return _checker;
};
