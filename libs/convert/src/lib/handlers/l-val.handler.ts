import { Expression, Identifier, LVal, MemberExpression } from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultUnhandledIdentifierHandler } from '@js-to-lua/lua-conversion-utils';
import {
  LuaBinaryExpression,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaMemberExpression,
  LuaNilLiteral,
} from '@js-to-lua/lua-types';
import { createMemberExpressionHandler } from './expression/member-expression.handler';

export const createLValHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<LuaLVal, LVal> => {
  const defaultLValHandler: HandlerFunction<LuaLVal, LVal> =
    createHandlerFunction((source, config, node) => {
      return defaultUnhandledIdentifierHandler(source, config, node);
    });

  const handleMemberExpression =
    createMemberExpressionHandler(handleExpression).handler;

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
