import { AssignmentPattern, Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './expression-statement.handler';
import { LuaFunctionParam } from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler, createHandler } from '../types';

export const functionParamsHandler = combineHandlers<
  BaseNodeHandler<LVal, LuaFunctionParam>
>([
  createHandler(
    'Identifier',
    (source, node: Identifier) =>
      handleIdentifier.handler(source, node) as LuaFunctionParam
  ),
  createHandler(
    'AssignmentPattern',
    (source, node: AssignmentPattern) =>
      handleIdentifier.handler(
        source,
        node.left as Identifier
      ) as LuaFunctionParam
  ),
]).handler;
