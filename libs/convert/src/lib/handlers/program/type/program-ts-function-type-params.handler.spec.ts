import {
  functionParamName,
  functionReturnType,
  identifier,
  typeAliasDeclaration,
  typeFunction,
  typeParameterDeclaration,
  typeReference,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TSFunctionType', () => {
    it('should handle function type declaration with generic type parameter', () => {
      const given = getProgramNode(
        `
        type Foo = <T, V>(bar: T, baz: V) => void
      `
      );
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeFunction(
            [
              functionParamName(
                identifier('bar'),
                typeReference(identifier('T'))
              ),
              functionParamName(
                identifier('baz'),
                typeReference(identifier('V'))
              ),
            ],
            functionReturnType([]),
            typeParameterDeclaration([
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ])
          )
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
