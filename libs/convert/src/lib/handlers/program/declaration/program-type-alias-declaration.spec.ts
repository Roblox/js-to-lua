import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  program,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeLiteral,
  typeNumber,
  typeOptional,
  typePropertySignature,
  typeReference,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TS: Type Alias Declaration', () => {
    it('should handle simple type declaration', () => {
      const given = getProgramNode(`
        type foo = any;
      `);
      const expected = program([
        typeAliasDeclaration(identifier('foo'), typeAny()),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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
          identifier('Object'),
          typeReference(identifier('LuauPolyfill.Object')),
          []
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle type union type declaration', () => {
      const given = getProgramNode(`
        type foo = number | string | TypeReference;
      `);
      const expected = program([
        typeAliasDeclaration(
          identifier('foo'),
          typeUnion([
            typeNumber(),
            typeString(),
            typeReference(identifier('TypeReference')),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle type alias declaration with generic params', () => {
      const given = getProgramNode(`
        type Foo<T> = {
          bar: number;
        }
      `);
      const expected = program([
        typeAliasDeclaration(
          identifier('Foo'),
          typeLiteral([
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(typeNumber())
            ),
          ]),
          [typeReference(identifier('T'))]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle type alias declaration with generic params on both sides', () => {
      const given = getProgramNode(`
        type Foo<T> = Bar<T>
      `);
      const expected = program([
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Bar'), [typeReference(identifier('T'))]),
          [typeReference(identifier('T'))]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle type alias declaration with generic params and multiple params on right side', () => {
      const given = getProgramNode(`
        type Foo<T> = Record<string, T>
      `);
      const expected = program([
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Record'), [
            typeString(),
            typeReference(identifier('T')),
          ]),
          [typeReference(identifier('T'))]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
