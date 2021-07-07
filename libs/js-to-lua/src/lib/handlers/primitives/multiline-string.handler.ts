import { BaseNodeHandler, createHandler } from '../../types';
import { TemplateLiteral } from '@babel/types';
import {
  LuaMultilineStringLiteral,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';

export const handleMultilineStringLiteral: BaseNodeHandler<
  LuaMultilineStringLiteral | LuaStringLiteral,
  TemplateLiteral
> = createHandler('TemplateLiteral', (source, config, literal) => {
  return containsNewLine(literal)
    ? {
        type: 'MultilineStringLiteral',
        value: getMultilineString(literal),
      }
    : {
        type: 'StringLiteral',
        value: getString(literal),
      };
});

function getString(literal: TemplateLiteral) {
  return literal.quasis.reduce((accu, curr) => {
    return accu + (curr.value.cooked || curr.value.raw);
  }, '');
}

const getMultilineString = (literal: TemplateLiteral) => {
  const multilineString = getString(literal);
  return `${multilineString[0] === '\n' ? '\n' : ''}${multilineString}`;
};

const containsNewLine = (literal: TemplateLiteral): boolean => {
  return literal.quasis
    .map((element) => element.value.raw)
    .some((element) => /\n/.test(element));
};
