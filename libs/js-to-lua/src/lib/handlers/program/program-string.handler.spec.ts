import { handleProgram } from '@js-to-lua/js-to-lua';
import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';

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
          {
            type: 'UnhandledNode',
            start: 0,
            end: 1,
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

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
