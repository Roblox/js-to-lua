import { tsTypeParameter, tsTypeParameterDeclaration } from '@babel/types';
import {
  identifier,
  typeParameterDeclaration,
  typeReference,
} from '@js-to-lua/lua-types';
import { createTsTypeParameterDeclarationHandler } from './ts-type-parameter-declaration.handler';

describe('TSTypeParameterDeclaration handler', () => {
  const handleTsTypeParameterDeclaration =
    createTsTypeParameterDeclarationHandler().handler;

  const source = '';

  it('should handle single parameter', () => {
    const given = tsTypeParameterDeclaration([
      tsTypeParameter(undefined, undefined, 'T'),
    ]);

    const expected = typeParameterDeclaration([typeReference(identifier('T'))]);

    expect(handleTsTypeParameterDeclaration(source, {}, given)).toEqual(
      expected
    );
  });
  it('should handle multiple parameters', () => {
    const given = tsTypeParameterDeclaration([
      tsTypeParameter(undefined, undefined, 'T'),
      tsTypeParameter(undefined, undefined, 'U'),
    ]);

    const expected = typeParameterDeclaration([
      typeReference(identifier('T')),
      typeReference(identifier('U')),
    ]);

    expect(handleTsTypeParameterDeclaration(source, {}, given)).toEqual(
      expected
    );
  });
});
