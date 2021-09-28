import {
  identifier,
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
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

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
  });
});
