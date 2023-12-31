import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('TSImportEqualsDeclaration Handler', () => {
    it(`should handle external global module import`, () => {
      const source = `
        import foo = require('bar')
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
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

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
    it(`should handle external relative module import`, () => {
      const source = `
        import foo = require('./bar')
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
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

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
