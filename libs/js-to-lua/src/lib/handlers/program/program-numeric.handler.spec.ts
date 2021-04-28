import { handleProgram } from '@js-to-lua/js-to-lua';
import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Numeric', () => {
    it('should handle numeric expressions', () => {
      const given = getProgramNode(`
      1;
      2;
      34;

      1
      2
      34
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 2,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 34,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 2,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 34,
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
