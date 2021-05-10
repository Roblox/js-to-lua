import { Identifier } from '@babel/types';
import { LuaIdentifier, LuaNilLiteral } from '../lua-nodes.types';
import { handleIdentifier } from './identifier.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

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
    it(`should return Lua Identifier Node when name is not undefined`, () => {
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
});
