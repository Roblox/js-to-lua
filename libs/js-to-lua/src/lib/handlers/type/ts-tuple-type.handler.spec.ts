import {
  identifier as babelIdentifier,
  tsNumberKeyword,
  tsStringKeyword,
  tsTupleType,
  tsTypeReference,
} from '@babel/types';
import { identifier, typeReference, typeUnion } from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import { createTsTupleTypeHandler } from './ts-tuple-type.handler';

describe('TSTupleType handler', () => {
  const tsTupleTypeHandler = createTsTupleTypeHandler(mockNodeWithValueHandler)
    .handler;

  const source = '';

  it('should handle TSTupleType with a single type param', () => {
    const given = tsTupleType([tsTypeReference(babelIdentifier('Foo'))]);
    const expected = typeReference(identifier('Array'), [
      mockNodeWithValue(tsTypeReference(babelIdentifier('Foo'))),
    ]);

    expect(tsTupleTypeHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSTupleType with a two type param', () => {
    const given = tsTupleType([tsNumberKeyword(), tsStringKeyword()]);
    const expected = typeReference(identifier('Array'), [
      typeUnion([
        mockNodeWithValue(tsNumberKeyword()),
        mockNodeWithValue(tsStringKeyword()),
      ]),
    ]);

    expect(tsTupleTypeHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSTupleType with a multiple type param', () => {
    const given = tsTupleType([
      tsNumberKeyword(),
      tsStringKeyword(),
      tsTypeReference(babelIdentifier('Foo')),
    ]);
    const expected = typeReference(identifier('Array'), [
      typeUnion([
        mockNodeWithValue(tsNumberKeyword()),
        mockNodeWithValue(tsStringKeyword()),
        mockNodeWithValue(tsTypeReference(babelIdentifier('Foo'))),
      ]),
    ]);

    expect(tsTupleTypeHandler(source, {}, given)).toEqual(expected);
  });
});