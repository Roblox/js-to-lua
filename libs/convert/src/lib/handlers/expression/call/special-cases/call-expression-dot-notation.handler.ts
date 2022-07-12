import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import * as Babel from '@babel/types';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';
import { matchesBabelMemberExpressionObject } from './utils';
import { createCalleeExpressionHandlerFunction } from '../callee-expression.handler';
import {
  PolyfillID,
  stringInferableExpression,
  withPolyfillExtra,
} from '@js-to-lua/lua-conversion-utils';

type MemberExpressionPredicate = (node: Babel.MemberExpression) => boolean;

const isExpectCall = (node: Babel.MemberExpression): boolean => {
  return (
    Babel.isCallExpression(node.object) &&
    Babel.isIdentifier(node.object.callee) &&
    node.object.callee.name === 'expect'
  );
};

const isNestedExpectCall = (node: Babel.MemberExpression): boolean => {
  return (
    Babel.isMemberExpression(node.object) &&
    (isExpectCall(node.object) || isNestedExpectCall(node.object))
  );
};

export const USE_DOT_NOTATION_IN_CALL_EXPRESSION: Array<
  string | MemberExpressionPredicate
> = [
  'React',
  'Object',
  'Array',
  'jest',
  'console',
  'Promise',
  'chalk',
  isExpectCall,
  isNestedExpectCall,
];

export const ADD_POLYFILL_EXTRA_IN_CALL_EXPRESSION: Array<PolyfillID> = [
  'Object',
  'Array',
  'console',
];

export const createCallExpressionDotNotationHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  const handleCalleeExpression =
    createCalleeExpressionHandlerFunction(handleExpression);

  const handleCallExpressionArguments =
    createCallExpressionArgumentsHandler(handleExpression);

  return createOptionalHandlerFunction<LuaCallExpression, Babel.CallExpression>(
    (source, config, expression) => {
      const callee = expression.callee;

      if (!Babel.isMemberExpression(callee)) {
        return undefined;
      }
      if (
        USE_DOT_NOTATION_IN_CALL_EXPRESSION.some((identifierName) =>
          typeof identifierName === 'string'
            ? matchesBabelMemberExpressionObject(identifierName, callee)
            : identifierName(callee)
        )
      ) {
        const res =
          Babel.isIdentifier(callee.object) &&
          ADD_POLYFILL_EXTRA_IN_CALL_EXPRESSION.includes(
            callee.object.name as PolyfillID
          )
            ? withPolyfillExtra<LuaCallExpression, PolyfillID>(
                callee.object.name as PolyfillID
              )(
                callExpression(
                  handleCalleeExpression(source, config, expression.callee),
                  handleCallExpressionArguments(
                    source,
                    config,
                    expression.arguments
                  )
                )
              )
            : callExpression(
                handleCalleeExpression(source, config, expression.callee),
                handleCallExpressionArguments(
                  source,
                  config,
                  expression.arguments
                )
              );

        return matchesBabelMemberExpressionObject('chalk', callee)
          ? stringInferableExpression(res)
          : res;
      }
    }
  );
};
