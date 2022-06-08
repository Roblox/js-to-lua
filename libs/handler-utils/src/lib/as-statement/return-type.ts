import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnTypeInline } from './return-type-inline';
import { AsStatementReturnTypeStandaloneOrInline } from './return-type-standalone-or-inline';
import { AsStatementReturnTypeWithIdentifier } from './return-type-with-identifier';

export type AsStatementReturnType<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> =
  | AsStatementReturnTypeInline<R, I>
  | AsStatementReturnTypeWithIdentifier<R, I>
  | AsStatementReturnTypeStandaloneOrInline<R, I>;
