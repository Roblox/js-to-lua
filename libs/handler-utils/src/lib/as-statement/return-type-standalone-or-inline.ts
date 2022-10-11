import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnType } from './return-type';
import {
  asStatementReturnTypeInline,
  AsStatementReturnTypeInline,
} from './return-type-inline';

const STANDALONE_OR_INLINE_TYPE = 'STANDALONE_OR_INLINE';

type AsStatementStandalone<R extends LuaStatement = LuaStatement> = {
  preStatements: R[];
  statement: R;
  postStatements: R[];
};

export type AsStatementReturnTypeStandaloneOrInline<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  type: typeof STANDALONE_OR_INLINE_TYPE;
  standalone: AsStatementStandalone<R>;
  inline: AsStatementReturnTypeInline<R, I>;
};

const asStatementStandalone = <R extends LuaStatement = LuaStatement>(
  preStatements: AsStatementStandalone<R>['preStatements'],
  statement: AsStatementStandalone<R>['statement'],
  postStatements: AsStatementStandalone<R>['postStatements']
): AsStatementStandalone<R> => ({
  preStatements,
  statement,
  postStatements,
});

export const asStatementReturnTypeStandaloneOrInline = <
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
>(
  preStatements: R[],
  postStatements: R[],
  statement: R,
  inlineExpression: I
): AsStatementReturnTypeStandaloneOrInline<R, I> => {
  return {
    type: STANDALONE_OR_INLINE_TYPE,
    standalone: asStatementStandalone(preStatements, statement, postStatements),
    inline: asStatementReturnTypeInline(
      preStatements,
      inlineExpression,
      postStatements
    ),
  };
};

export const isAsStatementReturnTypeStandaloneOrInline = (
  value: AsStatementReturnType
): value is AsStatementReturnTypeStandaloneOrInline =>
  value.type === STANDALONE_OR_INLINE_TYPE;
