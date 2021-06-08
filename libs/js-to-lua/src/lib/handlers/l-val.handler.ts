import { Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './expression-statement.handler';
import { LuaLVal } from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler, createHandler } from '../types';

export const lValHandler = combineHandlers<BaseNodeHandler<LVal, LuaLVal>>([
  createHandler(
    'Identifier',
    (source, node: Identifier) =>
      handleIdentifier.handler(source, node) as LuaLVal
  ),
]).handler;
