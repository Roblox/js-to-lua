import {
  FlowType,
  Identifier,
  TSType,
  TSTypeAliasDeclaration,
  TypeAlias,
} from '@babel/types';
import { combineHandlers, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultElementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  LuaBinaryExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaType,
} from '@js-to-lua/lua-types';
import { createFlowTypeAliasHandler } from '../type/flow/type-alias.handler';
import { createTsTypeAliasDeclarationHandler } from '../type/ts/ts-type-alias-declaration.handler';

export const createTypeAliasDeclarationHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleTypes: HandlerFunction<LuaType, TSType | FlowType>
) => {
  return combineHandlers<LuaType, TSTypeAliasDeclaration | TypeAlias>(
    [
      createFlowTypeAliasHandler(handleIdentifier, handleTypes),
      createTsTypeAliasDeclarationHandler(handleIdentifier, handleTypes),
    ],
    defaultElementHandler
  );
};
