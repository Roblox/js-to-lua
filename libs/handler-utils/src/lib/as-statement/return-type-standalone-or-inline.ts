import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnType } from './return-type';

const STANDALONE_OR_INLINE_TYPE = 'STANDALONE_OR_INLINE';

type AsStatementStandalone<R extends LuaStatement = LuaStatement> = {
  preStatements: R[];
  statement: R;
  postStatements: R[];
};

type AsStatementWithIdentifiers<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  preStatements: R[];
  postStatements: R[];
  identifiers: I[];
};

export type AsStatementReturnTypeStandaloneOrInline<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  type: typeof STANDALONE_OR_INLINE_TYPE;
  standalone: AsStatementStandalone<R>;
  inline: AsStatementWithIdentifiers<R, I>;
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
  preStatements: AsStatementWithIdentifiers<R, I>['preStatements'],
  postStatements: AsStatementWithIdentifiers<R, I>['postStatements'],
  ...identifiers: AsStatementWithIdentifiers<R, I>['identifiers']
): AsStatementWithIdentifiers<R, I> => ({
  preStatements,
  postStatements,
  identifiers,
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
