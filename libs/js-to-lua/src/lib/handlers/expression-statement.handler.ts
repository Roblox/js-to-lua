import { BaseNodeHandler } from '../types';
import { Expression, ExpressionStatement } from '@babel/types';
import { combineHandlers } from '../utils/combine-handlers';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { LuaExpression, LuaExpressionStatement } from '../lua-nodes.types';

export const handleExpressionStatement: BaseNodeHandler<
  ExpressionStatement,
  LuaExpressionStatement
> = {
  type: 'ExpressionStatement',
  handler: (statement) => ({
    type: 'ExpressionStatement',
    expression: handleExpression.handler(statement.expression),
  }),
};

export const handleExpression = combineHandlers<
  BaseNodeHandler<Expression, LuaExpression>
>([handleNumericLiteral, handleStringLiteral, handleBooleanLiteral]);
