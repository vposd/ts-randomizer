import * as ts from 'typescript';
import { isArray } from 'lodash/fp';

import { generateNodeDescription } from './type-description-generate/node';
import { setTypeChecker } from './checker';

const TARGET_CALLERS = ['create', 'createMany', 'build'];
const TARGET_CLASS_NAME = 'Randomizer';

/**
 * Typescript transformer factory
 * @param program Program
 */
export const transformer =
  (
    program: ts.Program | { getTypeChecker(): ts.TypeChecker }
  ): ts.TransformerFactory<ts.SourceFile> =>
  context =>
  file => {
    setTypeChecker(program.getTypeChecker());
    return ts.visitNode(
      file,
      visitNode(context, program.getTypeChecker())
    ) as ts.SourceFile;
  };

const isTargetExpression = (target: ts.CallExpression) =>
  ts.isPropertyAccessExpression(target.expression) &&
  ts.isIdentifier(target.expression.expression) &&
  TARGET_CALLERS.includes(target.expression.name.text) &&
  target.expression.expression.text === TARGET_CLASS_NAME;

/**
 * Typescript AST Node visitor
 * @param context Transformation context
 * @param checker Type checker
 */
const visitNode =
  (context: ts.TransformationContext, checker: ts.TypeChecker): ts.Visitor =>
  node => {
    node = ts.visitEachChild(node, visitNode(context, checker), context);

    if (
      !ts.isCallExpression(node) ||
      !isTargetExpression(node) ||
      !node.typeArguments
    ) {
      return node;
    }

    const [typeArgument] = node.typeArguments;
    const typeTemplate = generateNodeDescription(typeArgument);
    const template = isArray(typeTemplate)
      ? ts.factory.createArrayLiteralExpression(
          typeTemplate.map(property =>
            ts.factory.createRegularExpressionLiteral(JSON.stringify(property))
          )
        )
      : ts.factory.createRegularExpressionLiteral(JSON.stringify(typeTemplate));

    return ts.factory.updateCallExpression(
      node,
      node.expression,
      node.typeArguments,
      [template, ...node.arguments]
    );
  };
