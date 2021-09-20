import { ThisExpression } from '@babel/types';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler } from '../../types';

export const createThisExpressionHandler = (): BaseNodeHandler<
  LuaIdentifier,
  ThisExpression
> => createHandler('ThisExpression', () => identifier('self'));
