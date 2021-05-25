import { BaseNodeHandler } from '../types';
import { TemplateLiteral } from '@babel/types';
import { LuaMultilineStringLiteral } from '@js-to-lua/lua-types';

export const handleMultilineStringLiteral: BaseNodeHandler<
  TemplateLiteral,
  LuaMultilineStringLiteral
> = {
  type: 'TemplateLiteral',
  handler: (literal) => {
    return {
      type: 'MultilineStringLiteral',
      value: getMultilineString(literal),
    };
  },
};

const getMultilineString = (literal: TemplateLiteral) => {
  const multilineString = literal.quasis.reduce((accu, curr) => {
    return accu + (curr.value.cooked || curr.value.raw);
  }, '');
  return `${multilineString[0] === '\n' ? '\n' : ''}${multilineString}`;
};
