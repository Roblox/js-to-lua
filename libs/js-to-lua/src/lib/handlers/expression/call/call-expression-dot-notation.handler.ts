import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import {
  CallExpression,
  Expression,
  isCallExpression as isBabelCallExpression,
  isIdentifier as isBabelIdentifier,
  isMemberExpression as isBabelMemberExpression,
  MemberExpression,
} from '@babel/types';
import { matchesBabelMemberExpressionObject } from './utils';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';

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

export const createCallExpressionDotNotationHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleCalleeExpression =
    createCalleeExpressionHandlerFunction(handleExpression);

  return createOptionalHandlerFunction<LuaCallExpression, CallExpression>(
    (source, config, expression) => {
      const callee = expression.callee;
      if (
        !isBabelMemberExpression(callee) ||
        USE_DOT_NOTATION_IN_CALL_EXPRESSION.some((identifierName) =>
          typeof identifierName === 'string'
            ? matchesBabelMemberExpressionObject(identifierName, callee)
            : identifierName(callee)
        )
      ) {
        const toExpression = handleExpression(source, config);
        return callExpression(
          handleCalleeExpression(source, config, expression.callee),
          expression.arguments.map(toExpression)
        );
      }
    }
  );
};
