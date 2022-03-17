import {
  typeParameter as babelTypeParameter,
  typeParameterDeclaration as babelTypeParameterDeclaration,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  identifier,
  typeParameterDeclaration,
  typeReference,
} from '@js-to-lua/lua-types';
import { createFlowTypeParameterDeclarationHandler } from './type-parameter-declaration.handler';

const { mockNodeWithValueHandler, withBabelComments, withLuaComments } =
  testUtils;

describe('Flow - TypeParameterDeclaration handler', () => {
  const handler = createFlowTypeParameterDeclarationHandler(
    mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should handle single parameter', () => {
    const given = babelTypeParameterDeclaration([
      { ...babelTypeParameter(), name: 'T' },
    ]);
    const expected = typeParameterDeclaration([typeReference(identifier('T'))]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle multiple parameters', () => {
    const given = babelTypeParameterDeclaration([
      { ...babelTypeParameter(), name: 'T' },
      { ...babelTypeParameter(), name: 'U' },
    ]);
    const expected = typeParameterDeclaration([
      typeReference(identifier('T')),
      typeReference(identifier('U')),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(
      babelTypeParameterDeclaration([{ ...babelTypeParameter(), name: 'T' }])
    );
    const expected = withLuaComments(
      typeParameterDeclaration([typeReference(identifier('T'))])
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
