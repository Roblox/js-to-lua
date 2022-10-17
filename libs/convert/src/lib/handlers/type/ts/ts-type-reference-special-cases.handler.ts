import {
  Identifier,
  TSQualifiedName,
  TSType,
  TSTypeReference,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineOptionalHandlerFunctions,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaIdentifier, LuaType } from '@js-to-lua/lua-types';
import { createTsTypeReferenceBuiltInHandler } from './ts-type-reference-built-in.handler';

export const createTsTypeReferenceSpecialCasesHandler = (
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>,
  tsQualifiedNameHandler: BaseNodeHandler<LuaIdentifier, TSQualifiedName>,
  tsTypeHandlerFunction: HandlerFunction<LuaType, TSType>
) =>
  combineOptionalHandlerFunctions<LuaType, TSTypeReference>([
    createTsTypeReferenceBuiltInHandler(
      identifierHandlerFunction,
      tsQualifiedNameHandler,
      tsTypeHandlerFunction
    ),
  ]);
