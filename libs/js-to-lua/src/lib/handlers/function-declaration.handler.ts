import { FunctionDeclaration } from '@babel/types';
import { LuaFunctionDeclaration, LuaIdentifier } from '../lua-nodes.types';
import { BaseNodeHandler } from '../types';
import { functionDeclarationParamsHandler } from './function-declaration-params.handler';
import { handleIdentifier } from './expression-statement.handler';
import { handleStatement } from './statement.handler';

export const handleFunctionDeclaration: BaseNodeHandler<
  FunctionDeclaration,
  LuaFunctionDeclaration
> = {
  type: 'FunctionDeclaration',
  handler: (node) => {
    return {
      type: 'FunctionDeclaration',
      id: handleIdentifier.handler(node.id) as LuaIdentifier,
      params: node.params.map(functionDeclarationParamsHandler),
      defaultValues: node.params.filter(
        (param) => param.type === 'AssignmentPattern'
      ), // TODO: should be handled LuaAssignmentPattern
      body: node.body.body.map(handleStatement.handler),
    };
  },
};
