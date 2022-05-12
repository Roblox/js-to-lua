import { BlockStatement, Statement } from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { unwrapStatement } from '@js-to-lua/lua-conversion-utils';
import { LuaBlockStatement, LuaStatement } from '@js-to-lua/lua-types';

export const createBlockStatementHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<LuaBlockStatement, BlockStatement> =>
  createHandler('BlockStatement', (source, config, block) => {
    const body = Array.isArray(block.body) ? block.body : [block.body];
    const toStatement = handleStatement(source, config);
    return {
      type: 'BlockStatement',
      body: body.map(toStatement).map(unwrapStatement),
    };
  });
