import { identifier as babelIdentifier } from '@babel/types';
import { forwardHandlerRef } from '@js-to-lua/handler-utils';
import {
  createWithAlternativeExpressionExtras,
  createWithOriginalIdentifierNameExtras,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  identifier,
  LuaIdentifier,
  memberExpression,
  nilLiteral,
  numericLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { handleExpression } from '../expression-statement.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';
import {
  createIdentifierHandler,
  createIdentifierStrictHandler,
} from './identifier.handler';

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

const GLOBALS = ['error', 'table', 'string', 'tostring', 'version'];

const UNHANDLED_CHARS_IDENTIFIERS = [
  { givenName: '$foo', expectedName: '_foo' },
  { givenName: '$$foo', expectedName: '__foo' },
  { givenName: '$$foo$$', expectedName: '__foo__' },
];

const handleIdentifierStrict = createIdentifierStrictHandler(
  forwardHandlerRef(() => handleExpression)
);

const handleIdentifier = createIdentifierHandler(
  createTypeAnnotationHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifierStrict)
  ).typesHandler
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
      const expected = createWithAlternativeExpressionExtras(
        stringLiteral(name)
      )(createWithOriginalIdentifierNameExtras(name)(identifier(`${name}_`)));

      expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
    });
  });

  GLOBALS.forEach((name) => {
    it(`should return Lua Identifier Node with '_' prepended when name is not undefined and is a global`, () => {
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
        createWithOriginalIdentifierNameExtras(givenName)(
          identifier(expectedName)
        ),
        `ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: ${givenName}`
      );

      expect(handleIdentifier.handler(source, {}, given)).toEqual(expected);
    });
  });
});
