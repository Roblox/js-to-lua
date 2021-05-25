import { AssignmentPattern, Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './expression-statement.handler';
import { LuaFunctionParam } from '../lua-nodes.types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler } from '../types';

export const functionParamsHandler = combineHandlers<
  BaseNodeHandler<LVal, LuaFunctionParam>
>([
  {
    type: 'Identifier',
    handler: (node: Identifier) =>
      handleIdentifier.handler(node) as LuaFunctionParam,
  },
  {
    type: 'AssignmentPattern',
    handler: (node: AssignmentPattern) =>
      handleIdentifier.handler(node.left as Identifier) as LuaFunctionParam,
  },
]).handler;
