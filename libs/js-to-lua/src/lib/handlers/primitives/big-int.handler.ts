import { BaseNodeHandler, createHandler } from '../../types';
import { BigIntLiteral } from '@babel/types';
import { LuaNumericLiteral } from '@js-to-lua/lua-types';

export const handleBigIntLiteral: BaseNodeHandler<
  BigIntLiteral,
  LuaNumericLiteral
> = createHandler('BigIntLiteral', (source, literal) => {
  return {
    type: 'NumericLiteral',
    value: parseFloat(literal.value),
  };
});
