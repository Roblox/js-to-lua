import {
  identifier as babelIdentifier,
  tsArrayType,
  tsTypeReference,
} from '@babel/types';
import { withPolyfillTypeExtra } from '@js-to-lua/lua-conversion-utils';
import { identifier, typeReference } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { mockNodeWithValueHandler } from '../../testUtils/mock-node';
import { createTsArrayTypeHandler } from './ts-array-type.handler';

describe('TSArrayType handler', () => {
  const tsArrayTypeHandler = createTsArrayTypeHandler(
    mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should handle TSArrayType with a type param', () => {
    const given = tsArrayType(tsTypeReference(babelIdentifier('Test')));
    const expected = withPolyfillTypeExtra('Array', ['T'])(
      typeReference(identifier('Array'), [
        mockNodeWithValue(tsTypeReference(babelIdentifier('Test'))),
      ])
    );

    expect(tsArrayTypeHandler(source, {}, given)).toEqual(expected);
  });
});
