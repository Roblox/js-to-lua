import {
  tsArrayType,
  tsTypeReference,
  identifier as babelIdentifier,
} from '@babel/types';
import { identifier, typeReference } from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import { createTsArrayTypeHandler } from './ts-array-type.handler';

describe('TSArrayType handler', () => {
  const tsArrayTypeHandler = createTsArrayTypeHandler(mockNodeWithValueHandler)
    .handler;

  const source = '';

  it('should handle TSArrayType with a type param', () => {
    const given = tsArrayType(tsTypeReference(babelIdentifier('Test')));
    const expected = typeReference(identifier('Array'), [
      mockNodeWithValue(tsTypeReference(babelIdentifier('Test'))),
    ]);

    expect(tsArrayTypeHandler(source, {}, given)).toEqual(expected);
  });
});
