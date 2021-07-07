import { HandlerFunction } from '../../../types';
import {
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { Declaration, Expression, Identifier } from '@babel/types';
import { combineStatementHandlers } from '../../../utils/combine-handlers';
import { createImportDeclarationHandler } from './import-declaration.handler';

export const createImportHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) => {
  return combineStatementHandlers<LuaStatement, Declaration>([
    createImportDeclarationHandler(handleExpression, handleIdentifier),
  ]);
};
