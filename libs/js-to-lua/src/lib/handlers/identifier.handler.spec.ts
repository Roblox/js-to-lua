import { Identifier } from '@babel/types';
import {
  binaryExpression,
  identifier,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  memberExpression,
  nilLiteral,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { handleIdentifier } from './expression-statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

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
    const expected: LuaNilLiteral = nilLiteral();

    expect(handleIdentifier.handler(source, given)).toEqual(expected);
  });

  it(`should return math.huge member expression if identifier name is 'Infinity'`, () => {
    const given: Identifier = {
      ...DEFAULT_NODE,
      type: 'Identifier',
      name: 'Infinity',
    };
    const expected: LuaMemberExpression = memberExpression(
      identifier('math'),
      '.',
      identifier('huge')
    );

    expect(handleIdentifier.handler(source, given)).toEqual(expected);
  });

  it(`should return 0/0 if identifier name is 'NaN'`, () => {
    const given: Identifier = {
      ...DEFAULT_NODE,
      type: 'Identifier',
      name: 'NaN',
    };
    const expected = binaryExpression(
      numericLiteral(0),
      '/',
      numericLiteral(0)
    );

    expect(handleIdentifier.handler(source, given)).toEqual(expected);
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

    expect(handleIdentifier.handler(source, given)).toEqual(expected);
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

      expect(handleIdentifier.handler(source, given)).toEqual(expected);
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

      expect(handleIdentifier.handler(source, given)).toEqual(expected);
    });
  });
});
