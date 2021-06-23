import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { Expression, LogicalExpression } from '@babel/types';
import {
  booleanMethod,
  callExpression,
  logicalExpression,
  LuaExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  UnhandledNode,
} from '@js-to-lua/lua-types';
import { defaultHandler } from '../utils/default.handler';

export const createLogicalExpressionHandler = (
  handleExpression: HandlerFunction<Expression, LuaExpression>
): BaseNodeHandler<LogicalExpression, LuaLogicalExpression | UnhandledNode> =>
  createHandler('LogicalExpression', (source, node) => {
    switch (node.operator) {
      case '||': {
        const leftExpression = handleExpression(source, node.left);
        const rightExpression = handleExpression(source, node.right);
        return logicalExpression(
          LuaLogicalExpressionOperatorEnum.AND,
          callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            leftExpression,
            rightExpression
          )
        );
      }
      default:
        return defaultHandler(source, node);
    }
  });
