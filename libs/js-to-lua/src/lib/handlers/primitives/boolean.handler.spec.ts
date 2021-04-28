import { BooleanLiteral } from '@babel/types';
import { handleBooleanLiteral } from './boolean.handler';
import { LuaBooleanLiteral } from '../../lua-nodes.types';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Boolean Handler', () => {
  [true, false].forEach((value) => {
    it(`should return Lua Boolean Node with ${value} value`, () => {
      const given: BooleanLiteral = {
        ...DEFAULT_NODE,
        type: 'BooleanLiteral',
        value,
      };
      const expected: LuaBooleanLiteral = {
        type: 'BooleanLiteral',
        value,
      };

      expect(handleBooleanLiteral.handler(given)).toEqual(expected);
    });
  });
});
