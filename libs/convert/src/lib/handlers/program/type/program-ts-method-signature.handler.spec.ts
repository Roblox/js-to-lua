import {
  identifier,
  typeReference,
  typeParameterDeclaration,
  functionTypeParam,
  typeVoid,
  typeAliasDeclaration,
  program,
  typePropertySignature,
  typeLiteral,
  typeString,
  typeAnnotation,
  typeVariadicFunction,
  typeNumber,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TSMethodSignature', () => {
    it('should handle ts method signature with function param and rest parameters', () => {
      const given = getProgramNode(
        `
        interface Foo {
          bar: <T,V>(fizz: string, ...buzz: number[]) => void;
        }
      `
      );
      const expected = program([
        typeAliasDeclaration(
          identifier('Foo'),
          typeLiteral([
            typePropertySignature(
              identifier('bar'),
              typeAnnotation(
                typeVariadicFunction(
                  [functionTypeParam(identifier('fizz'), typeString())],
                  typeNumber(),
                  typeVoid(),
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
  });
});
