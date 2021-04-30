import { BaseNodeHandler } from '../types';
import { ArrayExpression, Expression, ExpressionStatement } from '@babel/types';
import { combineHandlers } from '../utils/combine-handlers';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import {
  LuaExpression,
  LuaExpressionStatement,
  LuaTableConstructor,
  LuaTableNoKeyField,
} from '../lua-nodes.types';

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

export const handleArrayExpression: BaseNodeHandler<
  ArrayExpression,
  LuaTableConstructor
> = {
  type: 'ArrayExpression',
  handler: ({ elements }) => {
    const handleExpressionTableNoKeyField: BaseNodeHandler<
      Expression,
      LuaTableNoKeyField
    > = {
      type: handleExpression.type,
      handler: (expression) => ({
        type: 'TableNoKeyField',
        value: handleExpression.handler(expression),
      }),
    };

    return {
      type: 'TableConstructor',
      elements: elements.map(handleExpressionTableNoKeyField.handler),
    };
  },
};

export const handleExpression = combineHandlers<
  BaseNodeHandler<Expression, LuaExpression>
>([
  handleNumericLiteral,
  handleStringLiteral,
  handleBooleanLiteral,
  handleArrayExpression,
]);
