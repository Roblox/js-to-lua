import { Expression, UnaryExpression } from '@babel/types';
import {
  bit32Identifier,
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  memberExpression,
  unaryDeleteExpression,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
  UnhandledStatement,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { defaultStatementHandler } from '../utils/default-handlers';
import { createExpressionAsBooleanHandler } from './handle-as-boolean';

export const createUnaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaUnaryDeleteExpression
  | LuaCallExpression
  | UnhandledStatement,
  UnaryExpression
> =>
  createHandler('UnaryExpression', (source, config, node: UnaryExpression) => {
    const expressionAsBooleanHandler = createExpressionAsBooleanHandler(
      handleExpression
    );
    switch (node.operator) {
      case 'typeof':
        return callExpression(identifier('typeof'), [
          handleExpression(source, config, node.argument),
        ]);
      case '+':
        return callExpression(identifier('tonumber'), [
          handleExpression(source, config, node.argument),
        ]);
      case '-':
        return unaryExpression(
          node.operator,
          handleExpression(source, config, node.argument)
        );
      case 'void':
        return unaryVoidExpression(
          handleExpression(source, config, node.argument)
        );
      case '!':
        return handleUnaryNegationExpression(source, node);
      case 'delete':
        return unaryDeleteExpression(
          handleExpression(source, config, node.argument)
        );
      case '~':
        return withTrailingConversionComment(
          callExpression(
            memberExpression(bit32Identifier(), '.', identifier('bnot')),
            [handleExpression(source, config, node.argument)]
          ),
          'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
        );
      default:
        return defaultStatementHandler(source, config, node);
    }

    function handleUnaryNegationExpression(
      source: string,
      node: UnaryExpression
    ) {
      return unaryNegationExpression(
        expressionAsBooleanHandler(source, config, node.argument)
      );
    }
  });
