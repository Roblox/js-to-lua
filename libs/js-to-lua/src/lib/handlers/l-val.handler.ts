import { Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './expression-statement.handler';
import { LuaLVal } from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler } from '../types';

export const lValHandler = combineHandlers<BaseNodeHandler<LVal, LuaLVal>>([
  {
    type: 'Identifier',
    handler: (node: Identifier) => handleIdentifier.handler(node) as LuaLVal,
  },
]).handler;
