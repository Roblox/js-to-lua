import { Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './expression-statement.handler';
import {
  identifier,
  LuaLVal,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';

export const defaultLValHandler: HandlerFunction<
  LuaLVal,
  LVal
> = createHandlerFunction((source, node) => {
  return withConversionComment(
    identifier('__unhandledIdentifier__'),
    `ROBLOX TODO: Unhandled node for type: ${node.type}`,
    source.slice(node.start, node.end)
  );
});

export const lValHandler = combineHandlers<
  LuaLVal,
  BaseNodeHandler<LuaLVal, LVal>
>(
  [
    createHandler('Identifier', (source, node: Identifier) =>
      handleIdentifier.handler(source, node)
    ),
  ],
  defaultLValHandler
).handler;
