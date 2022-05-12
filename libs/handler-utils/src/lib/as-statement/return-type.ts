import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnTypeInline } from './return-type-inline';
import { AsStatementReturnTypeStandaloneOrInline } from './return-type-standalone-or-inline';
import { AsStatementReturnTypeWithIdentifiers } from './return-type-with-identifiers';

export type AsStatementReturnType<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> =
  | AsStatementReturnTypeInline<R, I>
  | AsStatementReturnTypeWithIdentifiers<R, I>
  | AsStatementReturnTypeStandaloneOrInline<R, I>;
