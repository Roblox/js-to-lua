import { StringLiteral } from '@babel/types';
import { LuaStringLiteral } from '@js-to-lua/lua-types';
import { handleStringLiteral } from './string.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

describe('String Handler', () => {
  ['', 'abc', '1abc_@#$%'].forEach((value) => {
    it(`should return Lua String Node with value "${value}"`, () => {
      const given: StringLiteral = {
        ...DEFAULT_NODE,
        type: 'StringLiteral',
        value,
      };
      const expected: LuaStringLiteral = {
        type: 'StringLiteral',
        value,
      };

      expect(handleStringLiteral.handler(source, {}, given)).toEqual(expected);
    });
  });
});
