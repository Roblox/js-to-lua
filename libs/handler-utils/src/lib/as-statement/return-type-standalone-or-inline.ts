import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnType } from './return-type';

const STANDALONE_OR_INLINE_TYPE = 'STANDALONE_OR_INLINE';

type AsStatementStandalone<R extends LuaStatement = LuaStatement> = {
  preStatements: R[];
  statement: R;
  postStatements: R[];
};

type AsStatementWithIdentifier<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  preStatements: R[];
  postStatements: R[];
  identifier: I;
};

export type AsStatementReturnTypeStandaloneOrInline<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  type: typeof STANDALONE_OR_INLINE_TYPE;
  standalone: AsStatementStandalone<R>;
  inline: AsStatementWithIdentifier<R, I>;
};

export const asStatementStandalone = <R extends LuaStatement = LuaStatement>(
  preStatements: AsStatementStandalone<R>['preStatements'],
  statement: AsStatementStandalone<R>['statement'],
  postStatements: AsStatementStandalone<R>['postStatements']
): AsStatementStandalone<R> => ({
  preStatements,
  statement,
  postStatements,
});

export const asStatementInline = <
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
>(
  preStatements: AsStatementWithIdentifier<R, I>['preStatements'],
  postStatements: AsStatementWithIdentifier<R, I>['postStatements'],
  identifier: AsStatementWithIdentifier<R, I>['identifier']
): AsStatementWithIdentifier<R, I> => ({
  preStatements,
  postStatements,
  identifier,
});

export const asStatementReturnTypeStandaloneOrInline = <
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
>(
  standalone: AsStatementReturnTypeStandaloneOrInline<R, I>['standalone'],
  inline: AsStatementReturnTypeStandaloneOrInline<R, I>['inline']
): AsStatementReturnTypeStandaloneOrInline<R, I> => {
  return {
    type: STANDALONE_OR_INLINE_TYPE,
    standalone,
    inline,
  };
};

export const isAsStatementReturnTypeStandaloneOrInline = (
  value: AsStatementReturnType
): value is AsStatementReturnTypeStandaloneOrInline =>
  value.type === STANDALONE_OR_INLINE_TYPE;
