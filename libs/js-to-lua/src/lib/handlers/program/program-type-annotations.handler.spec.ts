import {
  identifier,
  program,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeLiteral,
  typeNumber,
  typePropertySignature,
  typeReference,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('TS: TypeAnnotations', () => {
    it('should handle "any"', () => {
      const given = getProgramNode(`
        let foo: any;
      `);
      const expected = program([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeAny()))
            ),
          ],
          []
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle "string"', () => {
      const given = getProgramNode(`
        let foo: string;
      `);
      const expected = program([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeString()))
            ),
          ],
          []
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle "number"', () => {
      const given = getProgramNode(`
        let foo: number;
      `);
      const expected = program([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeNumber()))
            ),
          ],
          []
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle "boolean"', () => {
      const given = getProgramNode(`
        let foo: boolean;
      `);
      const expected = program([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              identifier('foo', typeAnnotation(typeBoolean()))
            ),
          ],
          []
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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
      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle type reference', () => {
      const source = `
        let foo: TypeReference;
      `;
      const given = getProgramNode(source);
      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
