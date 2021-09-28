import { BaseNodeHandler, createHandler } from '../../types';
import { BigIntLiteral } from '@babel/types';
import { LuaNumericLiteral, numericLiteral } from '@js-to-lua/lua-types';

export const handleBigIntLiteral: BaseNodeHandler<
  LuaNumericLiteral,
  BigIntLiteral
> = createHandler('BigIntLiteral', (source, config, literal) => {
  return numericLiteral(parseFloat(literal.value), literal.value);
});
