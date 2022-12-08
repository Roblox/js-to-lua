import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  typeAliasDeclaration,
  typeParameterDeclaration,
  typeReference,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

describe('Program handler', () => {
  describe('TS basic types', () => {
    it('should handle TSObjectKeyword', () => {
      const source = '';
      const given = getProgramNode(`
        type MyType = object;
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
          identifier('Object'),
          typeReference(identifier('LuauPolyfill.Object'))
        ),
        typeAliasDeclaration(
          identifier('MyType'),
          typeUnion([
            typeReference(identifier('Object')),
            typeReference(identifier('Array'), [
              typeReference(identifier('unknown')),
            ]),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
