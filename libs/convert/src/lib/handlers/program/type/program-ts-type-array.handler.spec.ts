import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  typeAliasDeclaration,
  typeNumber,
  typeParameterDeclaration,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TS: Array Type', () => {
    it('should handle simple array type declaration', () => {
      const given = getProgramNode(`
        type NumberArray = number[];
      `);
      const expected = programWithUpstreamComment([
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
          typeParameterDeclaration([typeReference(identifier('T'))])
        ),
        typeAliasDeclaration(
          identifier('NumberArray'),
          typeReference(identifier('Array'), [typeNumber()])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle nested array type declarations', () => {
      const given = getProgramNode(`
        type NumberArray = number[][];
      `);
      const expected = programWithUpstreamComment([
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
          typeParameterDeclaration([typeReference(identifier('T'))])
        ),
        typeAliasDeclaration(
          identifier('NumberArray'),
          typeReference(identifier('Array'), [
            typeReference(identifier('Array'), [typeNumber()]),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
