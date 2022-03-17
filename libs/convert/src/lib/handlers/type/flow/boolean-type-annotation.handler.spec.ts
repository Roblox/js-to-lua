import { booleanTypeAnnotation } from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { typeBoolean } from '@js-to-lua/lua-types';
import { createFlowBooleanTypeAnnotationHandler } from './boolean-type-annotation.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - BooleanTypeAnnotation handler', () => {
  const handler = createFlowBooleanTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = booleanTypeAnnotation();
    const expected = typeBoolean();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(booleanTypeAnnotation());
    const expected = withLuaComments(typeBoolean());

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
