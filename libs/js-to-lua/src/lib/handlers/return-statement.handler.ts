import { ReturnStatement } from '@babel/types';
import { LuaReturnStatement, returnStatement } from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler } from '../types';
import { handleExpression } from './expression-statement.handler';

export const handleReturnStatement: BaseNodeHandler<
  ReturnStatement,
  LuaReturnStatement
> = createHandler('ReturnStatement', (source, node) =>
  returnStatement(handleExpression.handler(source, node.argument))
);
