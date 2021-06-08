import { LuaProgram, unhandledNode } from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('String', () => {
    it('should handle string expressions', () => {
      // The leading `;` is to prevent Babel from parsing standalone strings as directives e.g "use strict"
      const given = getProgramNode(`;
      "1"
      "2"
      "34"

      "1"
      "2"
      "34"
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          // we do not handle EmptyStatements yet
          unhandledNode(),
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: '1',
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: '2',
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: '34',
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: '1',
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: '2',
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: '34',
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(source, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
