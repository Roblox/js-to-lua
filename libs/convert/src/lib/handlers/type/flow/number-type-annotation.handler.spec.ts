import { numberTypeAnnotation } from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { typeNumber } from '@js-to-lua/lua-types';
import { createFlowNumberTypeAnnotationHandler } from './number-type-annotation.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - NumberTypeAnnotation handler', () => {
  const handler = createFlowNumberTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = numberTypeAnnotation();
    const expected = typeNumber();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(numberTypeAnnotation());
    const expected = withLuaComments(typeNumber());

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
