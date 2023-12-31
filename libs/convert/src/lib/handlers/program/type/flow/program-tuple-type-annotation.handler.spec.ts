import {
  identifier,
  typeAliasDeclaration,
  typeAny,
  typeLiteral,
  typeNumber,
  typeReference,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TupleTypeAnnotation', () => {
    it('should handle simple tuple type declaration with single param', () => {
      const given = getProgramNode(
        `
        type SingleNumber = [number];
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('SingleNumber'),
          typeReference(identifier('Array'), [typeNumber()])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle simple empty tuple type', () => {
      const given = getProgramNode(
        `
        type SingleNumber = [];
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(identifier('SingleNumber'), typeLiteral([])),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle simple tuple type declaration with multiple params', () => {
      const given = getProgramNode(
        `
        type CustomTuple = [number, string, Foo<any>];
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('CustomTuple'),
          typeReference(identifier('Array'), [
            typeUnion([
              typeNumber(),
              typeString(),
              typeReference(identifier('Foo'), [typeAny()]),
            ]),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle nested tuple type declarations', () => {
      const given = getProgramNode(
        `
        type NestedTuple = [[number], [string, any, [Foo, Bar, Baz<any>]]];
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('NestedTuple'),
          typeReference(identifier('Array'), [
            typeUnion([
              typeReference(identifier('Array'), [typeNumber()]),
              typeReference(identifier('Array'), [
                typeUnion([
                  typeString(),
                  typeAny(),
                  typeReference(identifier('Array'), [
                    typeUnion([
                      typeReference(identifier('Foo')),
                      typeReference(identifier('Bar')),
                      typeReference(identifier('Baz'), [typeAny()]),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
