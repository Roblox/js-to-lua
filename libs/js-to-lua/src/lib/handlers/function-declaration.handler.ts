import { Expression, FunctionDeclaration, LVal, Statement } from '@babel/types';
import {
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { createConvertToFunctionDeclarationHandler } from './declaration.handler';

export const createFunctionDeclarationHandler = (
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<LuaFunctionDeclaration, FunctionDeclaration> =>
  createHandler('FunctionDeclaration', (source, config, node) => {
    const convertToFunctionDeclaration = createConvertToFunctionDeclarationHandler(
      handleStatement,
      handleExpression,
      handleIdentifier
    );
    return convertToFunctionDeclaration(
      source,
      config,
      node,
      handleIdentifier(source, config, node.id!) as LuaIdentifier
    );
  });
