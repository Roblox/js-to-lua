import {
  Expression,
  FunctionDeclaration,
  LVal,
  Statement,
  Declaration,
} from '@babel/types';
import {
  LuaDeclaration,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { createConvertToFunctionDeclarationHandler } from './declaration.handler';

export const createFunctionDeclarationHandler = (
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  handleDeclaration: HandlerFunction<LuaNodeGroup | LuaDeclaration, Declaration>
): BaseNodeHandler<LuaFunctionDeclaration, FunctionDeclaration> =>
  createHandler('FunctionDeclaration', (source, config, node) => {
    const convertToFunctionDeclaration = createConvertToFunctionDeclarationHandler(
      handleStatement,
      handleExpression,
      handleExpressionAsStatement,
      handleIdentifier,
      handleDeclaration
    );
    return convertToFunctionDeclaration(
      source,
      config,
      node,
      handleIdentifier(source, config, node.id!) as LuaIdentifier
    );
  });
