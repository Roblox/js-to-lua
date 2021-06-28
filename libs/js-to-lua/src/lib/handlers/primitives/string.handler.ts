import { BaseNodeHandler, createHandler } from '../../types';
import { StringLiteral } from '@babel/types';
import { LuaStringLiteral } from '@js-to-lua/lua-types';

export const handleStringLiteral: BaseNodeHandler<
  LuaStringLiteral,
  StringLiteral
> = createHandler('StringLiteral', (source, literal) => {
  const _raw = literal.extra?.raw;
  let raw: string = undefined;
  if (typeof _raw === 'string' && _raw.slice(1, -1) !== literal.value) {
    raw = _raw.replace(/\\\r\n/g, '').replace(/\\\n/g, ''); // remove line continuation
  }

  const extra = raw
    ? {
        extra: {
          raw,
        },
      }
    : {};

  return {
    type: 'StringLiteral',
    value: literal.value,
    ...extra,
  };
});
