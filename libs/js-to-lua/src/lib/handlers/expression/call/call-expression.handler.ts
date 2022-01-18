import { createHandler, HandlerFunction } from '../../../types';
import {
  CallExpression,
  Expression,
  isCallExpression as isBabelCallExpression,
  isIdentifier as isBabelIdentifier,
  isMemberExpression as isBabelMemberExpression,
  MemberExpression,
} from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  LuaIdentifier,
  memberExpression,
} from '@js-to-lua/lua-types';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';
import { createKnownArrayMethodCallHandler } from './known-array-method-call.handler';

type MemberExpressionPredicate = (node: MemberExpression) => boolean;

const isExpectCall = (node: MemberExpression): boolean => {
  return (
    isBabelCallExpression(node.object) &&
    isBabelIdentifier(node.object.callee) &&
    node.object.callee.name === 'expect'
  );
};

const isNestedExpectCall = (node: MemberExpression): boolean => {
  return (
    isBabelMemberExpression(node.object) &&
    (isExpectCall(node.object) || isNestedExpectCall(node.object))
  );
};

export const USE_DOT_NOTATION_IN_CALL_EXPRESSION: Array<
  string | MemberExpressionPredicate
> = ['React', 'Object', 'Array', isExpectCall, isNestedExpectCall];

export const createCallExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleCalleeExpression =
    createCalleeExpressionHandlerFunction(handleExpression);

  const handleKnownArrayMethods =
    createKnownArrayMethodCallHandler(handleExpression);

  return createHandler(
    'CallExpression',
    (source, config, expression: CallExpression): LuaCallExpression => {
      if (
        expression.callee.type !== 'MemberExpression' ||
        USE_DOT_NOTATION_IN_CALL_EXPRESSION.some((identifierName) =>
          typeof identifierName === 'string'
            ? matchesMemberExpressionObject(
                identifierName,
                expression.callee as MemberExpression
              )
            : identifierName(expression.callee as MemberExpression)
        )
      ) {
        return callExpression(
          handleCalleeExpression(source, config, expression.callee),
          expression.arguments.map(handleExpression(source, config))
        );
      }

      const handled = handleKnownArrayMethods(source, config, {
        ...expression,
        callee: expression.callee,
      });
      if (handled) {
        return handled;
      }

      if (
        matchesMemberExpressionProperty('toString', expression.callee) &&
        !expression.arguments.length
      ) {
        return callExpression(identifier('tostring'), [
          handleCalleeExpression(source, config, expression.callee.object),
        ]);
      }

      if (expression.callee.computed) {
        return callExpression(
          handleCalleeExpression(source, config, expression.callee),
          [
            handleCalleeExpression(source, config, expression.callee.object),
            ...(expression.arguments.map(
              handleExpression(source, config)
            ) as LuaExpression[]),
          ]
        );
      }

      return callExpression(
        memberExpression(
          handleExpression(source, config, expression.callee.object),
          ':',
          handleExpression(
            source,
            config,
            expression.callee.property as Expression
          ) as LuaIdentifier
        ),
        expression.arguments.map(handleExpression(source, config))
      );
    }
  );
};

function matchesMemberExpressionProperty(
  identifierName: string,
  node: MemberExpression
): boolean {
  return (
    (!node.computed &&
      node.property.type === 'Identifier' &&
      node.property.name === identifierName) ||
    (node.computed &&
      node.property.type === 'StringLiteral' &&
      node.property.value === identifierName)
  );
}

function matchesMemberExpressionObject(
  identifierName: string,
  node: MemberExpression
): boolean {
  return (
    node.object.type === 'Identifier' && node.object.name === identifierName
  );
}
