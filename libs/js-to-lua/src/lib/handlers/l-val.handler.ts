import { Expression, Identifier, LVal, MemberExpression } from '@babel/types';
import {
  LuaBinaryExpression,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaMemberExpression,
  LuaNilLiteral,
} from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { createMemberExpressionHandler } from './expression/member-expression.handler';
import { defaultUnhandledIdentifierHandler } from '../utils/default-handlers';

export const createLValHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<LuaLVal, LVal> => {
  const defaultLValHandler: HandlerFunction<
    LuaLVal,
    LVal
  > = createHandlerFunction((source, config, node) => {
    return defaultUnhandledIdentifierHandler(source, config, node);
  });

  const handleMemberExpression = createMemberExpressionHandler(handleExpression)
    .handler;

  return combineHandlers<LuaLVal, LVal>(
    [
      createHandler('Identifier', (source, config, node: Identifier) =>
        handleIdentifier(source, config, node)
      ),
      createHandler(
        'MemberExpression',
        (source, config, node: MemberExpression) =>
          handleMemberExpression(source, config, node)
      ),
    ],
    defaultLValHandler
  );
};
