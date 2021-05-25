import { Identifier } from '@babel/types';
import { LuaIdentifier, LuaNilLiteral } from '@js-to-lua/lua-types';
import { handleIdentifier } from './expression-statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const KEYWORDS = [
  'and',
  'break',
  'do',
  'else',
  'elseif',
  'end',
  'false',
  'for',
  'function',
  'if',
  'in',
  'local',
  'nil',
  'not',
  'or',
  'repeat',
  'return',
  'then',
  'true',
  'until',
  'while',
];

describe('Identifier Handler', () => {
  it(`should return Lua NilLiteral Node if name is 'undefined'`, () => {
    const given: Identifier = {
      ...DEFAULT_NODE,
      type: 'Identifier',
      name: 'undefined',
    };
    const expected: LuaNilLiteral = {
      type: 'NilLiteral',
    };

    expect(handleIdentifier.handler(given)).toEqual(expected);
  });
  it(`should return math.huge name if identifier name is 'Infinity'`, () => {
    const given: Identifier = {
      ...DEFAULT_NODE,
      type: 'Identifier',
      name: 'Infinity',
    };
    const expected: LuaIdentifier = {
      type: 'Identifier',
      name: 'math.huge',
    };

    expect(handleIdentifier.handler(given)).toEqual(expected);
  });
  it(`should return Lua Identifier Node if Symbol is present`, () => {
    const given: Identifier = {
      ...DEFAULT_NODE,
      type: 'Identifier',
      name: 'Symbol',
    };
    const expected: LuaIdentifier = {
      type: 'Identifier',
      name: 'Symbol',
    };

    expect(handleIdentifier.handler(given)).toEqual(expected);
  });

  ['foo', 'bar', 'baz'].forEach((name) => {
    it(`should return Lua Identifier Node when name is not undefined and is not a keyword`, () => {
      const given: Identifier = {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name,
      };
      const expected: LuaIdentifier = {
        type: 'Identifier',
        name,
      };

      expect(handleIdentifier.handler(given)).toEqual(expected);
    });
  });

  KEYWORDS.forEach((name) => {
    it(`should return Lua Identifier Node with '_' prepended when name is not undefined and is a keyword`, () => {
      const given: Identifier = {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name,
      };
      const expected: LuaIdentifier = {
        type: 'Identifier',
        name: `${name}_`,
      };

      expect(handleIdentifier.handler(given)).toEqual(expected);
    });
  });
});
