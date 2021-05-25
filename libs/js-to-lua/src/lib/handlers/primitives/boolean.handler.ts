import { BaseNodeHandler } from '../../types';
import { BooleanLiteral } from '@babel/types';
import { LuaBooleanLiteral } from '@js-to-lua/lua-types';

export const handleBooleanLiteral: BaseNodeHandler<
  BooleanLiteral,
  LuaBooleanLiteral
> = {
  type: 'BooleanLiteral',
  handler: (literal) => {
    return {
      type: 'BooleanLiteral',
      value: literal.value,
    };
  },
};
