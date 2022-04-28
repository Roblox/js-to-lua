import {
  identifier,
  typeReference,
  typeParameterDeclaration,
  typeFunction,
  functionTypeParam,
  typeVoid,
  typeAliasDeclaration,
  program,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TSFunctionType', () => {
    it('should handle function type declaration with generic type parameter', () => {
      const given = getProgramNode(
        `
        type Foo = <T, V>(bar: T, baz: V) => void
      `
      );
      const expected = program([
        typeAliasDeclaration(
          identifier('Foo'),
          typeFunction(
            [
              functionTypeParam(
                identifier('bar'),
                typeReference(identifier('T'))
              ),
              functionTypeParam(
                identifier('baz'),
                typeReference(identifier('V'))
              ),
            ],
            typeVoid(),
            typeParameterDeclaration([
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ])
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
