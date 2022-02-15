import { ThisExpression } from '@babel/types';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';

export const createThisExpressionHandler = (): BaseNodeHandler<
  LuaIdentifier,
  ThisExpression
> => createHandler('ThisExpression', () => identifier('self'));
