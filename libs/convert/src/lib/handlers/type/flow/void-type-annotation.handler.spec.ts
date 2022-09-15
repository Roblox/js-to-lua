import * as Babel from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withVoidTypePolyfillExtra } from '@js-to-lua/lua-conversion-utils';
import { identifier, typeReference } from '@js-to-lua/lua-types';
import { createFlowVoidTypeAnnotationHandler } from './void-type-annotation.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - VoidTypeAnnotation handler', () => {
  const handler = createFlowVoidTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = Babel.voidTypeAnnotation();
    const expected = withVoidTypePolyfillExtra(
      typeReference(identifier('void'))
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(Babel.voidTypeAnnotation());
    const expected = withLuaComments(
      withVoidTypePolyfillExtra(typeReference(identifier('void')))
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
