import { Identifier } from '@babel/types';
import { handleIdentifier } from './identifier.handler';
import { LuaNilLiteral } from '../lua-nodes.types';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('NilLiteral Handler', () => {
  it(`should return Lua NilLiteral Node`, () => {
    const given: Identifier = {
      ...DEFAULT_NODE,
      type: 'Identifier',
      name: 'undefined',
    };
    const expected: LuaNilLiteral = {
      type: 'NilLiteral',
      value: null,
      raw: 'nil',
    };

    expect(handleIdentifier.handler(given)).toEqual(expected);
  });
});
