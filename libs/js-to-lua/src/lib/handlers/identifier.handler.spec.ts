import { identifier as babelIdentifier } from '@babel/types';
import {
  binaryExpression,
  identifier,
  LuaIdentifier,
  memberExpression,
  nilLiteral,
  numericLiteral,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { createIdentifierHandler } from './identifier.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import { handleExpression } from './expression-statement.handler';
import { createWithOriginalIdentifierNameExtras } from '../utils/with-original-identifier-name-extras';

const source = '';

const KEYWORDS = [
  'and',
  'break',
  'do',
  'else',
  'elseif',
  'end',
  'false',
  'for',
  'function',
  'if',
  'in',
  'local',
  'nil',
  'not',
  'or',
  'repeat',
  'return',
  'then',
  'true',
  'until',
  'while',
];

const UNHANDLED_CHARS_IDENTIFIERS = [
  { givenName: '$foo', expectedName: '_foo' },
  { givenName: '$$foo', expectedName: '__foo' },
  { givenName: '$$foo$$', expectedName: '__foo__' },
];

const handleIdentifier = createIdentifierHandler(
  createTypeAnnotationHandler(forwardHandlerRef(() => handleExpression))
    .typesHandler
);

describe('Identifier Handler', () => {
  it(`should return Lua NilLiteral Node if name is 'undefined'`, () => {
    const given = babelIdentifier('undefined');
    const expected = nilLiteral();

    expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return math.huge member expression if identifier name is 'Infinity'`, () => {
    const given = babelIdentifier('Infinity');
    const expected = memberExpression(
      identifier('math'),
      '.',
      identifier('huge')
    );

    expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return 0/0 if identifier name is 'NaN'`, () => {
    const given = babelIdentifier('NaN');
    const expected = binaryExpression(
      numericLiteral(0),
      '/',
      numericLiteral(0)
    );

    expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Identifier Node if Symbol is present`, () => {
    const given = babelIdentifier('Symbol');
    const expected = identifier('Symbol');

    expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
  });

  ['foo', 'bar', 'baz'].forEach((name) => {
    it(`should return Lua Identifier Node when name is not undefined and is not a keyword`, () => {
      const given = babelIdentifier(name);
      const expected = identifier(name);

      expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
    });
  });

  KEYWORDS.forEach((name) => {
    it(`should return Lua Identifier Node with '_' prepended when name is not undefined and is a keyword`, () => {
      const given = babelIdentifier(name);
      const expected = createWithOriginalIdentifierNameExtras(name)(
        identifier(`${name}_`)
      );

      expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
    });
  });

  UNHANDLED_CHARS_IDENTIFIERS.forEach(({ givenName, expectedName }) => {
    it(`should return Lua Identifier Node with '_' instead of unsupported characters`, () => {
      const source = `${givenName}`;
      const given = {
        ...babelIdentifier(givenName),
        start: 0,
        end: source.length,
      };
      const expected: LuaIdentifier = withTrailingConversionComment(
        identifier(expectedName),
        `ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: ${givenName}`
      );

      expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
    });
  });
});
