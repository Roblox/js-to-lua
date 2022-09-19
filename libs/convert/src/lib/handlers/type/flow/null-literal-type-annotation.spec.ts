import * as Babel from '@babel/types';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import { typeNil } from '@js-to-lua/lua-types';
import { createNullLiteralTypeAnnotationHandler } from './null-literal-type-annotation';

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
