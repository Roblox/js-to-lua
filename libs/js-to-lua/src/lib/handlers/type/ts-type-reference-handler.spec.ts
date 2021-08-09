import { createTsTypeReferenceHandler } from './ts-type-reference-handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import {
  identifier as babelIdentifier,
  tsAnyKeyword as babelTsAnyKeyword,
  tsTypeParameterInstantiation as babelTsTypeParameterInstantiation,
  tsTypeReference as babelTsTypeReference,
} from '@babel/types';
import { typeReference } from '@js-to-lua/lua-types';

describe('TSTypeReference handler', () => {
  const tsTypeReferenceHandler = createTsTypeReferenceHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should handle TSTypeReference without generic params', () => {
    const given = babelTsTypeReference(babelIdentifier('TypeReference'));

    const expected = typeReference(
      mockNodeWithValue(babelIdentifier('TypeReference'))
    );

    expect(tsTypeReferenceHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSTypeReference with generic params', () => {
    const given = babelTsTypeReference(
      babelIdentifier('TypeReference'),
      babelTsTypeParameterInstantiation([babelTsAnyKeyword()])
    );

    const expected = typeReference(
      mockNodeWithValue(babelIdentifier('TypeReference')),
      [mockNodeWithValue(babelTsAnyKeyword())]
    );

    expect(tsTypeReferenceHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSTypeReference with empty generic params', () => {
    const given = babelTsTypeReference(
      babelIdentifier('TypeReference'),
      babelTsTypeParameterInstantiation([])
    );

    const expected = typeReference(
      mockNodeWithValue(babelIdentifier('TypeReference'))
    );

    expect(tsTypeReferenceHandler(source, {}, given)).toEqual(expected);
  });
});
