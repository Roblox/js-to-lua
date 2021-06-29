import { BlockStatement, Statement } from '@babel/types';
import { LuaBlockStatement, LuaStatement } from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';

export const createBlockStatementHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<LuaBlockStatement, BlockStatement> =>
  createHandler('BlockStatement', (source, block) => {
    const body = Array.isArray(block.body) ? block.body : [block.body];
    return {
      type: 'BlockStatement',
      body: body.map(handleStatement(source)),
    };
  });
