import { LuaExpression, LuaLVal, LuaStatement } from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { AsStatementReturnType } from './return-type';

const IDENTIFIERS_TYPE = 'IDENTIFIERS';

export type AsStatementReturnTypeWithIdentifiers<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  type: typeof IDENTIFIERS_TYPE;
  preStatements: R[];
  postStatements: R[];
  identifiers: NonEmptyArray<I>;
};

export const asStatementReturnTypeWithIdentifier = <
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaLVal
>(
  preStatements: AsStatementReturnTypeWithIdentifiers<R, I>['preStatements'],
  postStatements: AsStatementReturnTypeWithIdentifiers<R, I>['postStatements'],
  ...identifiers: AsStatementReturnTypeWithIdentifiers<R, I>['identifiers']
): AsStatementReturnTypeWithIdentifiers<R, I> => ({
  type: IDENTIFIERS_TYPE,
  preStatements,
  postStatements,
  identifiers,
});

export const isAsStatementReturnTypeWithIdentifier = (
  value: AsStatementReturnType
): value is AsStatementReturnTypeWithIdentifiers =>
  value.type === IDENTIFIERS_TYPE;
