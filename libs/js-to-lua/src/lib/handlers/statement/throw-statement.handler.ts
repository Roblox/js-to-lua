import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  expressionStatement,
  identifier,
  LuaExpression,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { Expression, ThrowStatement } from '@babel/types';

export const createThrowStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<LuaStatement, ThrowStatement> =>
  createHandler(
    'ThrowStatement',
    (source, config, node): LuaStatement =>
      expressionStatement(
        callExpression(identifier('error'), [
          handleExpression(source, config, node.argument),
        ])
      )
  );
