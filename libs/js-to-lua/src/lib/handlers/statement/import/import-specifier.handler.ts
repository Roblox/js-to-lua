import { Expression, Identifier } from '@babel/types';
import { HandlerFunction } from '@js-to-lua/handler-utils';
import { combineStatementHandlers } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { createImportDefaultSpecifierHandler } from './import-default-specifier.handler';
import { createImportNamedSpecifierHandler } from './import-named-specifier.handler';
import { createImportNamespaceSpecifierHandler } from './import-namespace-specifier.handler';

export const createImportSpecifierHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression
) =>
  combineStatementHandlers<LuaStatement>([
    createImportNamedSpecifierHandler(
      handleExpression,
      handleIdentifier,
      moduleIdentifier
    ),
    createImportDefaultSpecifierHandler(handleIdentifier, moduleIdentifier),
    createImportNamespaceSpecifierHandler(handleIdentifier, moduleIdentifier),
  ]);
