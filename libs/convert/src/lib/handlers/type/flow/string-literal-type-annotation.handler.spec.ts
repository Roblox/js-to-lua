import * as Babel from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { literalType, stringLiteral } from '@js-to-lua/lua-types';
import { createStringLiteralTypeAnnotationHandler } from './string-literal-type-annotation.handler';

const { withBabelComments, withLuaComments } = testUtils;

describe('Flow - StringLiteralTypeAnnotation handler', () => {
  const handler = createStringLiteralTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = Babel.stringLiteralTypeAnnotation('boom');
    const expected = literalType(stringLiteral('boom'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(Babel.stringLiteralTypeAnnotation('boom'));
    const expected = withLuaComments(literalType(stringLiteral('boom')));

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
