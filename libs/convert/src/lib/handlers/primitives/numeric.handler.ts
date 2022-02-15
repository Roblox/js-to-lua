import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { NumericLiteral } from '@babel/types';
import { LuaNumericLiteral } from '@js-to-lua/lua-types';

export const handleNumericLiteral: BaseNodeHandler<
  LuaNumericLiteral,
  NumericLiteral
> = createHandler('NumericLiteral', (source, config, literal) => {
  const _raw = literal.extra?.raw;
  let raw: string | undefined = undefined;
  if (
    typeof _raw === 'string' &&
    validNumberStrings.some((regexp) => regexp.test(_raw))
  ) {
    raw = _raw;
  }

  const extra = raw
    ? {
        extra: {
          raw,
        },
      }
    : {};

  return {
    type: 'NumericLiteral',
    value: literal.value,
    ...extra,
  };
});

const validNumberStrings = [
  /^0$/, // zero
  /^[1-9]_?((\d+_?)*?([E|e][+-]?(\d+_?)*)?)?\d*(?<!_)$/, // decimal without leading 0 and support for `_` separator - optional scientific notation
  /^0_?(\d+_?)*[8-9+]_?(\d+_?)*([E|e][+-]?(\d+_?)*)?\d*(?<!_)$/, // decimal with leading 0 - has to contain at least one digit larger than 7 and support for `_` separator - optional scientific notation
  /^0[xX]([\da-fA-F]+_?)+[\da-fA-F]*(?<!_)$/, // hex representation and support for `_` separator
  /^0[bB]([01]+_?)*[01]*(?<!_)$/, // binary representation and support for `_` separator
  /^[+-]?(\d+_?)+\.(\d+_?)*([E|e][+-]?(\d+_?)*\d)?\d*(?<!_)$/, // floating point number - possible no digits after '.'  and support for `_` separator
  /^[+-]?((\d+_?)*\d)?\.(\d+_?)*([E|e][+-]?(\d+_?)*\d)?\d*(?<!_)$/, // floating point number - possible no digits before '.'
];
