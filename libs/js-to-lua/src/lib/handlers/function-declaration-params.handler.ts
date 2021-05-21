import { AssignmentPattern, Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './expression-statement.handler';
import { LuaFunctionDeclarationParam } from '../lua-nodes.types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler } from '../types';

export const functionDeclarationParamsHandler = combineHandlers<
  BaseNodeHandler<LVal, LuaFunctionDeclarationParam>
>([
  {
    type: 'Identifier',
    handler: (node: Identifier) =>
      handleIdentifier.handler(node) as LuaFunctionDeclarationParam,
  },
  {
    type: 'AssignmentPattern',
    handler: (node: AssignmentPattern) =>
      handleIdentifier.handler(
        node.left as Identifier
      ) as LuaFunctionDeclarationParam,
  },
]).handler;
