import {
  identifier as babelIdentifier,
  tsArrayType,
  tsTypeReference,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withPolyfillTypeExtra } from '@js-to-lua/lua-conversion-utils';
import { identifier, typeReference } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsArrayTypeHandler } from './ts-array-type.handler';

describe('TSArrayType handler', () => {
  const tsArrayTypeHandler = createTsArrayTypeHandler(
    testUtils.mockNodeWithValueHandler
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
