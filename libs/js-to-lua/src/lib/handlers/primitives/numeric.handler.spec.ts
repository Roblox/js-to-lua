import { NumericLiteral } from '@babel/types';
import { LuaNumericLiteral } from '../../lua-nodes.types';
import { handleNumericLiteral } from './numeric.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Numeric Handler', () => {
  [1, 2, 5, 10, NaN].forEach((value) => {
    it(`should return Lua Numeric Node with value ${value}`, () => {
      const given: NumericLiteral = {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value,
      };
      const expected: LuaNumericLiteral = {
        type: 'NumericLiteral',
        value,
      };

      expect(handleNumericLiteral.handler(given)).toEqual(expected);
    });
  });
});
