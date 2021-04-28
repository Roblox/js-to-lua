import { BaseNodeHandler } from '../../types';
import { NumericLiteral } from '@babel/types';
import { LuaNumericLiteral } from '../../lua-nodes.types';

export const handleNumericLiteral: BaseNodeHandler<
  NumericLiteral,
  LuaNumericLiteral
> = {
  type: 'NumericLiteral',
  handler: (literal) => {
    return {
      type: 'NumericLiteral',
      value: literal.value,
    };
  },
};
