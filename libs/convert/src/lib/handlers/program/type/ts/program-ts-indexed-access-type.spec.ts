import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  indexExpression,
  memberExpression,
  numericLiteral,
  tableConstructor,
  typeAliasDeclaration,
  typeAny,
  typeCastExpression,
  typeofExpression,
  typeReference,
  typeUnion,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

describe('Program handler', () => {
  describe('TSIndexedAccessType handler', () => {
    it('should handle type indexed with string', () => {
      const source = `
        type Test = Foo["bar"]
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeofExpression(
            memberExpression(
              typeCastExpression(
                typeCastExpression(tableConstructor(), typeAny()),
                typeReference(identifier('Foo'))
              ),
              '.',
              identifier('bar')
            )
          )
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle type indexed with number keyword (with added comment)', () => {
      const source = `
        type Test = Foo[number]
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          withTrailingConversionComment(
            typeofExpression(
              indexExpression(
                typeCastExpression(
                  typeCastExpression(tableConstructor(), typeAny()),
                  typeReference(identifier('Foo'))
                ),
                numericLiteral(1)
              )
            ),
            'ROBLOX CHECK: Resulting type may differ',
            'Upstream: Foo[number]'
          )
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle type indexed with type reference (with added comment)', () => {
      const source = `
        type Test = Foo[Bar]
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          withTrailingConversionComment(
            typeAny(),
            'ROBLOX FIXME: Luau types cannot be used for indexing.',
            'Upstream: Foo[Bar]'
          )
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle type indexed with union', () => {
      const source = `
        type Test = Foo["bar"|"baz"]
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeUnion([
            typeofExpression(
              memberExpression(
                typeCastExpression(
                  typeCastExpression(tableConstructor(), typeAny()),
                  typeReference(identifier('Foo'))
                ),
                '.',
                identifier('bar')
              )
            ),
            typeofExpression(
              memberExpression(
                typeCastExpression(
                  typeCastExpression(tableConstructor(), typeAny()),
                  typeReference(identifier('Foo'))
                ),
                '.',
                identifier('baz')
              )
            ),
          ])
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});
