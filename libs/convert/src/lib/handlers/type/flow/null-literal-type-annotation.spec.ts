import * as Babel from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import { typeNil, typeOptional } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createNullLiteralTypeAnnotationHandler } from './null-literal-type-annotation';
import { createNullableTypeAnnotationHandler } from './nullable-type-annotation.handler';

const { withBabelComments, withLuaComments, mockNodeWithValueHandler } =
  testUtils;

describe('Flow - NullLiteralTypeAnnotation handler', () => {
  const { handler } = createNullLiteralTypeAnnotationHandler();

  const source = '';

  it('should handle node', () => {
    const given = Babel.nullLiteralTypeAnnotation();
    const expected = withTrailingConversionComment(
      typeNil(),
      "ROBLOX CHECK: verify if `null` wasn't used differently than `undefined`"
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
