import { mixedTypeAnnotation } from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { identifier, typeReference } from '@js-to-lua/lua-types';
import { createFlowMixedTypeAnnotationHandler } from './mixed-type-annotation.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - MixedTypeAnnotation handler', () => {
  const handler = createFlowMixedTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = mixedTypeAnnotation();
    const expected = typeReference(identifier('unknown'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(mixedTypeAnnotation());
    const expected = withLuaComments(typeReference(identifier('unknown')));

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
