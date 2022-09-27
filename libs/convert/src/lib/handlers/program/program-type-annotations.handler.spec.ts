import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  functionDeclaration,
  identifier,
  nodeGroup,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIntersection,
  typeLiteral,
  typeNil,
  typeNumber,
  typeOptional,
  typePropertySignature,
  typeQuery,
  typeReference,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TS: TypeAnnotations', () => {
    it('should handle "any"', () => {
      const given = getProgramNode(`
        let foo: any;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeAny()))
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle "string"', () => {
      const given = getProgramNode(`
        let foo: string;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeString()))
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle "number"', () => {
      const given = getProgramNode(`
        let foo: number;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeNumber()))
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle "boolean"', () => {
      const given = getProgramNode(`
        let foo: boolean;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeBoolean()))
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle "unknown"', () => {
      const given = getProgramNode(`
        let foo: unknown;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier(
                'foo',
                typeAnnotation(typeReference(identifier('unknown')))
              )
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle "null"', () => {
      const given = getProgramNode(`
        let foo: null;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier(
                'foo',
                typeAnnotation(
                  withTrailingConversionComment(
                    typeNil(),
                    "ROBLOX CHECK: verify if `null` wasn't used differently than `undefined`"
                  )
                )
              )
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle "undefined"', () => {
      const given = getProgramNode(`
        let foo: undefined;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeNil()))
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle TSTypeQuery', () => {
      const given = getProgramNode(`
        let foo: typeof bar;
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeQuery(identifier('bar'))))
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle TSTypePredicate', () => {
      const source = `
        function foo(bar): bar is string {}
      `;
      const given = getProgramNode(source);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [identifier('bar')],
          nodeGroup([]),
          withTrailingConversionComment(
            typeBoolean(),
            'ROBLOX FIXME: change to TSTypePredicate equivalent if supported',
            'bar is string'
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type literal', () => {
      const given = getProgramNode(`
      let foo: {
        bar: number,
        baz: string,
        fizz: boolean,
        fuzz: any
      }
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier(
                'foo',
                typeAnnotation(
                  typeLiteral([
                    typePropertySignature(
                      identifier('bar'),
                      typeAnnotation(typeNumber())
                    ),
                    typePropertySignature(
                      identifier('baz'),
                      typeAnnotation(typeString())
                    ),
                    typePropertySignature(
                      identifier('fizz'),
                      typeAnnotation(typeBoolean())
                    ),
                    typePropertySignature(
                      identifier('fuzz'),
                      typeAnnotation(typeAny())
                    ),
                  ])
                )
              )
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type literal with optional properties', () => {
      const given = getProgramNode(`
      let foo: {
        bar?: number,
        baz?: string,
        fizz?: boolean,
        fuzz?: any
      }
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier(
                'foo',
                typeAnnotation(
                  typeLiteral([
                    typePropertySignature(
                      identifier('bar'),
                      typeAnnotation(typeOptional(typeNumber()))
                    ),
                    typePropertySignature(
                      identifier('baz'),
                      typeAnnotation(typeOptional(typeString()))
                    ),
                    typePropertySignature(
                      identifier('fizz'),
                      typeAnnotation(typeOptional(typeBoolean()))
                    ),
                    typePropertySignature(
                      identifier('fuzz'),
                      typeAnnotation(typeOptional(typeAny()))
                    ),
                  ])
                )
              )
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type reference', () => {
      const source = `
        let foo: TypeReference;
      `;
      const given = getProgramNode(source);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier(
                'foo',
                typeAnnotation(typeReference(identifier('TypeReference')))
              )
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type union', () => {
      const source = `
        let foo: number | string | TypeReference;
      `;
      const given = getProgramNode(source);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier(
                'foo',
                typeAnnotation(
                  typeUnion([
                    typeNumber(),
                    typeString(),
                    typeReference(identifier('TypeReference')),
                  ])
                )
              )
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle type intersection', () => {
      const source = `
        let foo: number & string & TypeReference;
      `;
      const given = getProgramNode(source);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier(
                'foo',
                typeAnnotation(
                  typeIntersection([
                    typeNumber(),
                    typeString(),
                    typeReference(identifier('TypeReference')),
                  ])
                )
              )
            ),
          ],
          []
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
