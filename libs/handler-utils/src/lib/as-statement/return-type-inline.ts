import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnType } from './return-type';

const INLINE_TYPE = 'INLINE';

export type AsStatementReturnTypeInline<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  type: typeof INLINE_TYPE;
  preStatements: R[];
  postStatements: R[];
  inlineExpression: I;
};

export const asStatementReturnTypeInline = <
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
>(
  preStatements: AsStatementReturnTypeInline<R, I>['preStatements'],
  inlineExpression: AsStatementReturnTypeInline<R, I>['inlineExpression'],
  postStatements: AsStatementReturnTypeInline<R, I>['postStatements']
): AsStatementReturnTypeInline<R, I> => {
  return {
    type: INLINE_TYPE,
    preStatements,
    postStatements,
    inlineExpression,
  };
};

export const isAsStatementReturnTypeInline = (
  value: AsStatementReturnType
): value is AsStatementReturnTypeInline => value.type === INLINE_TYPE;
