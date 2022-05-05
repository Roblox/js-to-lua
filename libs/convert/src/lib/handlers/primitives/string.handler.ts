import { StringLiteral } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { LuaStringLiteral } from '@js-to-lua/lua-types';

export const createStringLiteralHandler = () => {
  return createHandler<LuaStringLiteral, StringLiteral>(
    'StringLiteral',
    (source, config, literal) => {
      const _raw = literal.extra?.raw;
      let raw: string | undefined = undefined;
      if (typeof _raw === 'string' && _raw.slice(1, -1) !== literal.value) {
        raw = _raw
          // remove line continuations
          .replace(/\\\r\n/g, '')
          .replace(/\\\n/g, '')
          // wrap 4-digit Unicode escape sequences with curly brackets
          .replace(/\\u([0-9a-fA-F]{4})/g, '\\u{$1}');
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
    }
  );
};
