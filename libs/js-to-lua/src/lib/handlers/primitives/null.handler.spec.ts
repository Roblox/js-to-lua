import { NullLiteral } from '@babel/types';
import { handleNullLiteral } from './null.handler';
import { LuaNilLiteral } from '../../lua-nodes.types';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Null Literal Handler', () => {
  it(`should return Lua NilLiteral Node`, () => {
    const given: NullLiteral = {
      ...DEFAULT_NODE,
      type: 'NullLiteral',
    };
    const expected: LuaNilLiteral = {
      type: 'NilLiteral',
    };

    expect(handleNullLiteral.handler(given)).toEqual(expected);
  });
});
