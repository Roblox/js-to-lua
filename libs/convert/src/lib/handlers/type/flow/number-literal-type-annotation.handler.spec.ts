import { numberLiteralTypeAnnotation } from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import { typeNumber } from '@js-to-lua/lua-types';
import { withLocation } from '@js-to-lua/lua-types/test-utils';
import { createFlowNumberLiteralTypeAnnotationHandler } from './number-literal-type-annotation.handler';

const { withComments } = testUtils;

describe('Flow - NumberLiteralTypeAnnotation handler', () => {
  const { handler } = createFlowNumberLiteralTypeAnnotationHandler();

  it('should handle node', () => {
    const source = 'type Foo = 1';
    const given = withLocation({ start: 11, end: 12 })(
      numberLiteralTypeAnnotation(1)
    );
    const expected = withTrailingConversionComment(
      typeNumber(),
      `ROBLOX NOTE: changed '1' to 'number' as Luau doesn't support numeric singleton types`
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const source = 'type Foo = 1';
    const { given, expected } = withComments(
      withLocation({ start: 11, end: 12 })(numberLiteralTypeAnnotation(1)),
      withTrailingConversionComment(
        typeNumber(),
        `ROBLOX NOTE: changed '1' to 'number' as Luau doesn't support numeric singleton types`
      )
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
