import { stringTypeAnnotation } from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { typeString } from '@js-to-lua/lua-types';
import { createFlowStringTypeAnnotationHandler } from './string-type-annotation.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - StringTypeAnnotation handler', () => {
  const handler = createFlowStringTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = stringTypeAnnotation();
    const expected = typeString();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(stringTypeAnnotation());
    const expected = withLuaComments(typeString());

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
