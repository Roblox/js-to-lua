import {
  withInnerConversionComment,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  stringLiteral,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIndexSignature,
  typeIntersection,
  typeLiteral,
  typeNumber,
  typePropertySignature,
  typeReference,
  typeString,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

describe('Program handler', () => {
  describe('Flow - ObjectTypeAnnotation handler', () => {
    it('should handle empty ObjectTypeAnnotation', () => {
      const source = `
        type Test = {};
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(identifier('Test'), typeLiteral([])),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with props with simple types', () => {
      const source = `
        type Test = {
          foo: string,
          bar: number,
          baz: boolean
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeLiteral([
            typePropertySignature(
              identifier('foo'),
              typeAnnotation(typeString())
            ),
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(typeNumber())
            ),
            typePropertySignature(
              identifier('baz'),
              typeAnnotation(typeBoolean())
            ),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with props with simple types and string literals as keys', () => {
      const source = `
        type Test = {
          'foo': string,
          'bar': number,
          'baz': boolean
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeLiteral([
            typePropertySignature(
              stringLiteral('foo'),
              typeAnnotation(typeString())
            ),
            typePropertySignature(
              stringLiteral('bar'),
              typeAnnotation(typeNumber())
            ),
            typePropertySignature(
              stringLiteral('baz'),
              typeAnnotation(typeBoolean())
            ),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with nested ObjectTypeAnnotation', () => {
      const source = `
        type Test = {
          nested: {
            foo: string,
            bar: number,
            baz: boolean
          }
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeLiteral([
            typePropertySignature(
              identifier('nested'),
              typeAnnotation(
                typeLiteral([
                  typePropertySignature(
                    identifier('foo'),
                    typeAnnotation(typeString())
                  ),
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeNumber())
                  ),
                  typePropertySignature(
                    identifier('baz'),
                    typeAnnotation(typeBoolean())
                  ),
                ])
              )
            ),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty', () => {
      const source = `
        type Test = {
          ...AnotherType
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeReference(identifier('AnotherType'))
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeSpreadProperty and additional props', () => {
      const source = `
        type Test = {
          ...AnotherType,
          foo: string,
          bar: number,
          baz: boolean
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeIntersection([
            typeReference(identifier('AnotherType')),
            typeLiteral([
              typePropertySignature(
                identifier('foo'),
                typeAnnotation(typeString())
              ),
              typePropertySignature(
                identifier('bar'),
                typeAnnotation(typeNumber())
              ),
              typePropertySignature(
                identifier('baz'),
                typeAnnotation(typeBoolean())
              ),
            ]),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeIndexer', () => {
      const source = `
        type Test = {
          [string]: number
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeLiteral([
            typeIndexSignature(typeString(), typeAnnotation(typeNumber())),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with multiple ObjectTypeIndexers', () => {
      const source = dedent`
        type Test = {
          [string]: number,
          [number]: boolean
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          withTrailingConversionComment(
            typeAny(),
            `ROBLOX TODO: Unhandled node for type: ObjectTypeAnnotation when multiple indexers are present`,
            dedent`
              {
                [string]: number,
                [number]: boolean
              }
            `
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeCallProperty', () => {
      const source = `
        type Test = {
          (): any
        }
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          withInnerConversionComment(
            typeLiteral([]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
            '(): any'
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with multiple ObjectTypeCallProperties', () => {
      const source = `
        type Test = {
          (): any,
          (string): string
        };
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          withInnerConversionComment(
            typeLiteral([]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
            '(): any',
            '(string): string'
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with ObjectTypeInternalSlot', () => {
      const source = `
        type Test = {
          [[Slot]]: any
        }
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          withInnerConversionComment(
            typeLiteral([]),
            'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
            '[[Slot]]: any'
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle ObjectTypeAnnotation with all possible properties', () => {
      const source = `
        type Test = {
          prop: string,
          ...Foo,
          [string]: boolean,
          (): any,
          (string): string,
          [[Slot]]: any,
        }
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeIntersection([
            typeReference(identifier('Foo')),
            withInnerConversionComment(
              typeLiteral([
                typePropertySignature(
                  identifier('prop'),
                  typeAnnotation(typeString())
                ),
                typeIndexSignature(typeString(), typeAnnotation(typeBoolean())),
              ]),
              'ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty',
              '(): any',
              '(string): string',
              'ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot',
              '[[Slot]]: any'
            ),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
