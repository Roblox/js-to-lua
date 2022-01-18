import { HandlerFunction } from '../../../types';
import { Expression, Identifier } from '@babel/types';
import {
  AssignmentStatement,
  LuaExpression,
  LuaIdentifier,
} from '@js-to-lua/lua-types';
import { combineStatementHandlers } from '../../../utils/combine-handlers';
import { createExportNamedSpecifierHandler } from './export-named-specifier.handler';
import { createExportNamespaceSpecifierHandler } from './export-namespace-specifier.handler';

export const createExportSpecifierHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression | null
) =>
  combineStatementHandlers<AssignmentStatement>([
    createExportNamedSpecifierHandler(
      handleExpression,
      handleIdentifier,
      moduleIdentifier
    ),
    createExportNamespaceSpecifierHandler(handleExpression, moduleIdentifier),
  ]);
