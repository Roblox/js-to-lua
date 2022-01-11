import {
  callExpression,
  identifier,
  memberExpression,
  program,
  typeAliasDeclaration,
  typeNumber,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TS: Array Type', () => {
    it('should handle simple array type declaration', () => {
      const given = getProgramNode(`
        type NumberArray = number[];
      `);
      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        typeAliasDeclaration(
          identifier('Array'),
          typeReference(identifier('LuauPolyfill.Array<T>')),
          [typeReference(identifier('T'))]
        ),
        typeAliasDeclaration(
          identifier('NumberArray'),
          typeReference(identifier('Array'), [typeNumber()])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle nested array type declarations', () => {
      const given = getProgramNode(`
        type NumberArray = number[][];
      `);
      const expected = program([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        typeAliasDeclaration(
          identifier('Array'),
          typeReference(identifier('LuauPolyfill.Array<T>')),
          [typeReference(identifier('T'))]
        ),
        typeAliasDeclaration(
          identifier('NumberArray'),
          typeReference(identifier('Array'), [
            typeReference(identifier('Array'), [typeNumber()]),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
