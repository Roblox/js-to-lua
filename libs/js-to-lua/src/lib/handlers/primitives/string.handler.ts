import { BaseNodeHandler } from '../../types';
import { StringLiteral } from '@babel/types';
import { LuaStringLiteral } from '../../lua-nodes.types';

export const handleStringLiteral: BaseNodeHandler<
  StringLiteral,
  LuaStringLiteral
> = {
  type: 'StringLiteral',
  handler: (literal) => {
    return {
      type: 'StringLiteral',
      value: literal.value,
    };
  },
};
