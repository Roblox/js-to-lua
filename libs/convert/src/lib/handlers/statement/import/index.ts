import { Declaration, Expression, Identifier } from '@babel/types';
import { HandlerFunction } from '@js-to-lua/handler-utils';
import { combineStatementHandlers } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { createImportDeclarationHandler } from './import-declaration.handler';

export const createImportHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) => {
  return combineStatementHandlers<LuaStatement, Declaration>([
    createImportDeclarationHandler(handleExpression, handleIdentifier),
  ]);
};
