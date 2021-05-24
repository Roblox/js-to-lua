import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

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
              extra: {
                raw: '1',
              },
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 2,
              extra: {
                raw: '2',
              },
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 34,
              extra: {
                raw: '34',
              },
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 1,
              extra: {
                raw: '1',
              },
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 2,
              extra: {
                raw: '2',
              },
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 34,
              extra: {
                raw: '34',
              },
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
