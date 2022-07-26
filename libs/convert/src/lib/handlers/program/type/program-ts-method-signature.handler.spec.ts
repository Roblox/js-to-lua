import {
  functionParamName,
  functionReturnType,
  functionTypeParamEllipse,
  identifier,
  program,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeFunction,
  typeLiteral,
  typeNumber,
  typeParameterDeclaration,
  typePropertySignature,
  typeReference,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TSMethodSignature', () => {
    it('should handle ts method signature with function param and rest parameters', () => {
      const given = getProgramNode(`
        interface Foo {
          bar: <T,V>(fizz: string, ...buzz: number[]) => void;
        }
      `);
      const expected = program([
        typeAliasDeclaration(
          identifier('Foo'),
          typeLiteral([
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(
                typeFunction(
                  [
                    functionParamName(identifier('fizz'), typeString()),
                    functionTypeParamEllipse(typeNumber()),
                  ],
                  functionReturnType([]),
                  typeParameterDeclaration([
                    typeReference(identifier('T')),
                    typeReference(identifier('V')),
                  ])
                )
              )
            ),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle ts method signature in inline type annotation', () => {
      const given = getProgramNode(`
        let foo: { toString(): string }
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
                      identifier('toString'),
                      typeAnnotation(
                        typeFunction(
                          [functionParamName(identifier('self'), typeAny())],
                          functionReturnType([typeString()])
                        )
                      )
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
  });
});
