import {
  stringLiteral as babelStringLiteral,
  StringLiteral,
} from '@babel/types';
import { LuaStringLiteral, stringLiteral } from '@js-to-lua/lua-types';
import { createStringLiteralHandler } from './string.handler';

const source = '';

describe('String Handler', () => {
  const { handler } = createStringLiteralHandler();

  ['', 'abc', '1abc_@#$%'].forEach((value) => {
    it(`should return Lua String Node with value "${value}"`, () => {
      const given: StringLiteral = babelStringLiteral(value);
      const expected: LuaStringLiteral = stringLiteral(value);

      expect(handler(source, {}, given)).toEqual(expected);
    });
  });
});
