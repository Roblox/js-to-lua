import { Expression, Identifier, LVal, MemberExpression } from '@babel/types';
import {
  identifier,
  LuaBinaryExpression,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaMemberExpression,
  LuaNilLiteral,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { getNodeSource } from '../utils/get-node-source';
import { createMemberExpressionHandler } from './member-expression.handler';

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
    return withConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
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
