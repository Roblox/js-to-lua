import { handleProgram } from '@js-to-lua/js-to-lua';
import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Boolean', () => {
    it('should handle boolean expressions', () => {
      const given = getProgramNode(`
      true
      false

      true;
      false;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BooleanLiteral',
              value: true,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BooleanLiteral',
              value: false,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BooleanLiteral',
              value: true,
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BooleanLiteral',
              value: false,
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
