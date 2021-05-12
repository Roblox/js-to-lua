import { BaseNodeHandler } from '../../types';
import { NumericLiteral } from '@babel/types';
import { LuaNumericLiteral } from '../../lua-nodes.types';

export const handleNumericLiteral: BaseNodeHandler<
  NumericLiteral,
  LuaNumericLiteral
> = {
  type: 'NumericLiteral',
  handler: (literal) => {
    const _raw = literal.extra?.raw;
    let raw: string = undefined;
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
  },
};

const validNumberStrings = [
  /^[1-9][\d]*([E|e][+-]?[\d]*)?$/, // decimal without leading 0 - optional scientific notation
  /^0\d*[8-9+]\d*([E|e][+-]?[\d]*)?$/, // decimal with leading 0 - has to contain at least one digit larger than 7 - optional scientific notation
  /^0[xX][\da-fA-F]+$/, // hex representation
  /^0[bB][01]+$/, // binary representation
  /^[+-]?[\d]+\.[\d]*([E|e][+-]?[\d]*)?$/, // floating point number - possible no digits after '.'
  /^[+-]?[\d]*\.[\d]+([E|e][+-]?[\d]*)?$/, // floating point number - possible no digits before '.'
];
