import { Identifier, LVal } from '@babel/types';
import {
  identifier,
  LuaBinaryExpression,
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

export const createLValHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >
): BaseNodeHandler<LuaLVal, LVal> => {
  const defaultLValHandler: HandlerFunction<
    LuaLVal,
    LVal
  > = createHandlerFunction((source, node) => {
    return withConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      source.slice(node.start, node.end)
    );
  });

  return combineHandlers<LuaLVal, BaseNodeHandler<LuaLVal, LVal>>(
    [
      createHandler('Identifier', (source, node: Identifier) =>
        handleIdentifier(source, node)
      ),
    ],
    defaultLValHandler
  );
};
