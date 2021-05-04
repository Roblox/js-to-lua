import { Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './identifier.handler';
import { LuaLVal } from '../lua-nodes.types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler } from '../types';

export const lValHandler = combineHandlers<BaseNodeHandler<LVal, LuaLVal>>([
  {
    type: 'Identifier',
    handler: (node: Identifier) => handleIdentifier.handler(node) as LuaLVal,
  },
]).handler;
