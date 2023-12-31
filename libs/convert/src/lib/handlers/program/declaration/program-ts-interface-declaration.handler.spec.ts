import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeIntersection,
  typeLiteral,
  typeNumber,
  typeOptional,
  typeParameterDeclaration,
  typePropertySignature,
  typeReference,
  typeString,
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
  describe('TS: Interface Declaration', () => {
    it('should handle simple interface declaration', () => {
      const given = getProgramNode(`
        interface Foo {
          bar: string
        }
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeLiteral([
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(typeString())
            ),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle interface declaration with optional properties', () => {
      const given = getProgramNode(`
        interface Foo {
          bar?: string,
          baz?: number,
          fizz?: Object,
          buzz?: any
        }
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
          identifier('Foo'),
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

    it('should handle interface type declaration that extends other interface', () => {
      const given = getProgramNode(`
        interface Foo extends Bar {
          baz: number,
        }
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeIntersection([
            typeReference(identifier('Bar')),
            typeLiteral([
              typePropertySignature(
                identifier('baz'),
                typeAnnotation(typeNumber())
              ),
            ]),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle interface type declaration that extends multiple interfaces', () => {
      const given = getProgramNode(`
        interface Foo extends Bar, Fizz {
          baz: number,
        }
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeIntersection([
            typeReference(identifier('Bar')),
            typeReference(identifier('Fizz')),
            typeLiteral([
              typePropertySignature(
                identifier('baz'),
                typeAnnotation(typeNumber())
              ),
            ]),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle interface type declaration with generic params', () => {
      const given = getProgramNode(`
        interface Foo<T> {
          bar: number,
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

    it('should handle interface type declaration with generic params that extends other interface with generic param', () => {
      const given = getProgramNode(`
        interface Foo<T> extends Bar<T> {
          baz: number,
        }
      `);
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeIntersection([
            typeReference(identifier('Bar'), [typeReference(identifier('T'))]),
            typeLiteral([
              typePropertySignature(
                identifier('baz'),
                typeAnnotation(typeNumber())
              ),
            ]),
          ]),
          typeParameterDeclaration([typeReference(identifier('T'))])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
