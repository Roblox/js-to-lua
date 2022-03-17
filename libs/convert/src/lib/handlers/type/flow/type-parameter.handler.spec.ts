import {
  anyTypeAnnotation,
  typeParameter as babelTypeParameter,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { identifier, typeReference } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createFlowTypeParameterHandler } from './type-parameter.handler';

const { mockNodeWithValueHandler, withBabelComments, withLuaComments } =
  testUtils;

describe('Flow - TypeParameter handler', () => {
  const handler = createFlowTypeParameterHandler(
    mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should handle node', () => {
    const given = { ...babelTypeParameter(), name: 'T' };
    const expected = typeReference(identifier('T'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle node with default value', () => {
    const given = {
      ...babelTypeParameter(undefined, anyTypeAnnotation()),
      name: 'T',
    };
    const expected = typeReference(
      identifier('T'),
      undefined,
      mockNodeWithValue(anyTypeAnnotation())
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments({
      ...babelTypeParameter(),
      name: 'T',
    });
    const expected = withLuaComments(typeReference(identifier('T')));

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
