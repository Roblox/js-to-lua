import { BlockStatement } from '@babel/types';
import { LuaBlockStatement } from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler } from '../types';
import { handleStatement } from './expression-statement.handler';

export const handleBlockStatement: BaseNodeHandler<
  BlockStatement,
  LuaBlockStatement
> = createHandler('BlockStatement', (source, block) => {
  const body = Array.isArray(block.body) ? block.body : [block.body];
  return {
    type: 'BlockStatement',
    body: body.map(handleStatement.handler(source)),
  };
});
