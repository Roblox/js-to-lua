import { LuaProgram } from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

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
