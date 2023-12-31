import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeIndexSignature,
  typeLiteral,
  typeNumber,
  typeOptional,
  typeParameterDeclaration,
  typePropertySignature,
  typeReference,
  typeString,
  typeUnion,
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
  describe('TS: Type Alias Declaration', () => {
    it('should handle simple type declaration', () => {
      const given = getProgramNode(`
        type foo = any;
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(identifier('foo'), typeAny()),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type declaration with optional properties', () => {
      const given = getProgramNode(`
        type foo = {
          bar?: string,
          baz?: number,
          fizz?: Object,
          buzz?: any
        };
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
          identifier('Object'),
          typeReference(identifier('LuauPolyfill.Object')),
          undefined
        ),
        typeAliasDeclaration(
          identifier('foo'),
          typeLiteral([
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(typeOptional(typeString()))
            ),
            typePropertySignature(
              identifier('baz'),
              typeAnnotation(typeOptional(typeNumber()))
            ),
            typePropertySignature(
              identifier('fizz'),
              typeAnnotation(typeOptional(typeReference(identifier('Object'))))
            ),
            typePropertySignature(
              identifier('buzz'),
              typeAnnotation(typeOptional(typeAny()))
            ),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type union type declaration', () => {
      const given = getProgramNode(`
        type foo = number | string | TypeReference;
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('foo'),
          typeUnion([
            typeNumber(),
            typeString(),
            typeReference(identifier('TypeReference')),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type alias declaration with generic params', () => {
      const given = getProgramNode(`
        type Foo<T> = {
          bar: number;
        }
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeLiteral([
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(typeNumber())
            ),
          ]),
          typeParameterDeclaration([typeReference(identifier('T'))])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type alias declaration with generic params on both sides', () => {
      const given = getProgramNode(`
        type Foo<T> = Bar<T>
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Bar'), [typeReference(identifier('T'))]),
          typeParameterDeclaration([typeReference(identifier('T'))])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type alias declaration with generic params and multiple params on right side', () => {
      const given = getProgramNode(`
        type Foo<T> = Record<string, T>
      `);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          typeAliasDeclaration(
            identifier('Record'),
            typeLiteral([
              typeIndexSignature(
                typeReference(identifier('K')),
                typeAnnotation(typeReference(identifier('T')))
              ),
            ]),
            typeParameterDeclaration([
              typeReference(identifier('K')),
              typeReference(identifier('T')),
            ])
          ),
          "ROBLOX TODO: TS 'Record' built-in type is not available in Luau"
        ),
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Record'), [
            typeString(),
            typeReference(identifier('T')),
          ]),
          typeParameterDeclaration([typeReference(identifier('T'))])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
