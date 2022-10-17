import { Identifier, TSEntityName, TSQualifiedName } from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaIdentifier } from '@js-to-lua/lua-types';

export const createTsEntityNameHandler = (
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>,
  tsQualifiedNameHandler: BaseNodeHandler<LuaIdentifier, TSQualifiedName>
) =>
  combineHandlers<LuaIdentifier, TSEntityName>(
    [tsQualifiedNameHandler],
    identifierHandlerFunction
  ).handler;
