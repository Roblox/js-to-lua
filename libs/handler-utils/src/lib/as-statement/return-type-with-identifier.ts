import { LuaExpression, LuaLVal, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnType } from './return-type';

const IDENTIFIER_TYPE = 'IDENTIFIER';

export type AsStatementReturnTypeWithIdentifier<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = {
  type: typeof IDENTIFIER_TYPE;
  preStatements: R[];
  postStatements: R[];
  identifier: I;
};

export const asStatementReturnTypeWithIdentifier = <
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaLVal
>(
  preStatements: AsStatementReturnTypeWithIdentifier<R, I>['preStatements'],
  postStatements: AsStatementReturnTypeWithIdentifier<R, I>['postStatements'],
  identifier: AsStatementReturnTypeWithIdentifier<R, I>['identifier']
): AsStatementReturnTypeWithIdentifier<R, I> => ({
  type: IDENTIFIER_TYPE,
  preStatements,
  postStatements,
  identifier,
});

export const isAsStatementReturnTypeWithIdentifier = (
  value: AsStatementReturnType
): value is AsStatementReturnTypeWithIdentifier =>
  value.type === IDENTIFIER_TYPE;
