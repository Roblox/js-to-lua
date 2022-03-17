import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  program,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

describe('Program handler', () => {
  describe('TSImportEqualsDeclaration Handler', () => {
    it(`should handle external global module import`, () => {
      const source = `
        import foo = require('bar')
      `;
      const given = getProgramNode(source);

      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('bar')
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
    it(`should handle external relative module import`, () => {
      const source = `
        import foo = require('./bar')
      `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  memberExpression(
                    identifier('script'),
                    '.',
                    identifier('Parent')
                  ),
                  '.',
                  identifier('bar')
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
