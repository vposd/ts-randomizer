import * as ts from 'typescript';
import { isArray } from 'lodash/fp';

import { generateNodeDescription } from './description-generate';
import { isTargetExpression } from './utils';

/**
 * Typescript transformer factory
 * @param program Program
 */
export const transformer = (
  program: ts.Program
): ts.TransformerFactory<ts.SourceFile> => context => file =>
  ts.visitNode(file, visitNode(context, program.getTypeChecker()));

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
