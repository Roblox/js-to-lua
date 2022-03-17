import {
  anyTypeAnnotation,
  typeAnnotation as babelTypeAnnotation,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { typeAnnotation } from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import { createFlowTypeAnnotationHandler } from './type-annotation.handler';

const { mockNodeHandler, withBabelComments, withLuaComments } = testUtils;

describe('Flow - TypeAnnotation handler', () => {
  const handler = createFlowTypeAnnotationHandler(mockNodeHandler).handler;

  const source = '';

  it('should handle node', () => {
    const given = babelTypeAnnotation(anyTypeAnnotation());
    const expected = typeAnnotation(mockNode());

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(babelTypeAnnotation(anyTypeAnnotation()));
    const expected = withLuaComments(typeAnnotation(mockNode()));

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
