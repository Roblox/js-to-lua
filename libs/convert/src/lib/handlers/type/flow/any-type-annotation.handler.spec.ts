import { anyTypeAnnotation } from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { typeAny } from '@js-to-lua/lua-types';
import { createFlowAnyTypeAnnotationHandler } from './any-type-annotation.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - AnyTypeAnnotation handler', () => {
  const handler = createFlowAnyTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = anyTypeAnnotation();
    const expected = typeAny();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(anyTypeAnnotation());
    const expected = withLuaComments(typeAny());

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
