import { ReturnStatement } from '@babel/types';
import { LuaReturnStatement, returnStatement } from '@js-to-lua/lua-types';
import { BaseNodeHandler } from '../types';
import { handleExpression } from './expression-statement.handler';

export const handleReturnStatement: BaseNodeHandler<
  ReturnStatement,
  LuaReturnStatement
> = {
  type: 'ReturnStatement',
  handler: (node) => {
    return returnStatement(handleExpression.handler(node.argument));
  },
};
