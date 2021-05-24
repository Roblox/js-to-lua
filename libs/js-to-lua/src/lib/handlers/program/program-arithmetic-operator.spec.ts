import { handleProgram } from './program.handler';
import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Binary expression', () => {
    it('should handle arithmetic exponential operator', () => {
      const given = getProgramNode(`
     foo ** bar;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LuaBinaryExpression',
              left: {
                type: 'Identifier',
                name: 'foo',
              },
              operator: '^',
              right: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic subtract operator', () => {
      const given = getProgramNode(`
     foo - bar;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LuaBinaryExpression',
              left: {
                type: 'Identifier',
                name: 'foo',
              },
              operator: '-',
              right: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic multiplication operator', () => {
      const given = getProgramNode(`
     foo * bar;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LuaBinaryExpression',
              left: {
                type: 'Identifier',
                name: 'foo',
              },
              operator: '*',
              right: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic division operator', () => {
      const given = getProgramNode(`
     foo / bar;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LuaBinaryExpression',
              left: {
                type: 'Identifier',
                name: 'foo',
              },
              operator: '/',
              right: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic remainder operator', () => {
      const given = getProgramNode(`
     foo % bar;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LuaBinaryExpression',
              left: {
                type: 'Identifier',
                name: 'foo',
              },
              operator: '%',
              right: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator', () => {
      const given = getProgramNode(`
     foo + bar;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LuaBinaryExpression',
              left: {
                type: 'Identifier',
                name: 'foo',
              },
              operator: '+',
              right: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator with string literals', () => {
      const given = getProgramNode(`
     'foo' + 'bar';
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LuaBinaryExpression',
              left: {
                type: 'StringLiteral',
                value: 'foo',
              },
              operator: '..',
              right: {
                type: 'StringLiteral',
                value: 'bar',
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
