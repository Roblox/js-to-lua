import { Expression } from '@babel/types';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  expressionStatement,
  isCallExpression,
  isNodeGroup,
  isUnhandledExpression,
  LuaExpression,
  LuaExpressionStatement,
  LuaNodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { getNodeSource } from './get-node-source';

const isValidExpressionStatementExpression = (
  expression: LuaExpression | AssignmentStatement | LuaNodeGroup
): expression is LuaExpressionStatement['expression'] =>
  isCallExpression(expression) || isNodeGroup(expression);

export const createExpressionStatement = (
  source: string,
  babelExpression: Expression,
  expression: LuaExpression | AssignmentStatement | LuaNodeGroup
) => {
  return isValidExpressionStatementExpression(expression)
    ? expressionStatement(expression)
    : isUnhandledExpression(expression)
    ? {
        ...expression,
        ...unhandledStatement(),
      }
    : withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Lua doesn't support '${expression.type}' as a standalone type`,
        getNodeSource(source, babelExpression)
      );
};
