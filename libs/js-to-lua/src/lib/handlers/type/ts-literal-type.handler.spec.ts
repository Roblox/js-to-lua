import {
  booleanLiteral as babelBooleanLiteral,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
  tsLiteralType as babelTsLiteralType,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  booleanLiteral,
  literalType,
  stringLiteral,
  typeNumber,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsLiteralTypeHandler } from './ts-literal-type.handler';

describe('TSTypeReference handler', () => {
  const tsLiteralTypeHandler = createTsLiteralTypeHandler(
    testUtils.mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should handle numeric literals', () => {
    const given = babelTsLiteralType(babelNumericLiteral(1));

    const expected = typeNumber();

    expect(tsLiteralTypeHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle string literals', () => {
    const given = babelTsLiteralType(babelStringLiteral('foo'));

    const expected = literalType(mockNodeWithValue(stringLiteral('foo')));

    expect(tsLiteralTypeHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle boolean literals', () => {
    const given = babelTsLiteralType(babelBooleanLiteral(true));

    const expected = literalType(mockNodeWithValue(booleanLiteral(true)));

    expect(tsLiteralTypeHandler(source, {}, given)).toEqual(expected);
  });
});
