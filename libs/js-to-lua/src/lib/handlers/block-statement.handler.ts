import { BlockStatement } from '@babel/types';
import { LuaBlockStatement } from '../lua-nodes.types';
import { BaseNodeHandler } from '../types';
import { handleStatement } from './expression-statement.handler';

export const handleBlockStatement: BaseNodeHandler<
  BlockStatement,
  LuaBlockStatement
> = {
  type: 'BlockStatement',
  handler: (block) => {
    const body = Array.isArray(block.body) ? block.body : [block.body];
    return {
      type: 'BlockStatement',
      body: body.map(handleStatement.handler),
    };
  },
};
