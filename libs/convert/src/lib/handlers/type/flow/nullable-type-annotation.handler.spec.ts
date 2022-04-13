import { anyTypeAnnotation, nullableTypeAnnotation } from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { typeOptional } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createNullableTypeAnnotationHandler } from './nullable-type-annotation.handler';

const { withBabelComments, withLuaComments, mockNodeWithValueHandler } =
  testUtils;

describe('Flow - NullableTypeAnnotation handler', () => {
  const { handler } = createNullableTypeAnnotationHandler(
    mockNodeWithValueHandler
  );

  const source = '';

  it('should handle node', () => {
    const given = nullableTypeAnnotation(anyTypeAnnotation());
    const expected = typeOptional(mockNodeWithValue(anyTypeAnnotation()));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(
      nullableTypeAnnotation(anyTypeAnnotation())
    );
    const expected = withLuaComments(
      typeOptional(mockNodeWithValue(anyTypeAnnotation()))
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
