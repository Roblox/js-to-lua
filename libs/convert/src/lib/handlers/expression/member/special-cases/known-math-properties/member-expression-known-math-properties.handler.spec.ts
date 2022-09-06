import * as Babel from '@babel/types';
import { identifier, memberExpression } from '@js-to-lua/lua-types';
import { createMemberExpressionKnownMathPropertyHandlerFunction } from './member-expression-known-math-properties.handler';

const source = '';

describe('Known Math methods', () => {
  const handleKnownMathProperties =
    createMemberExpressionKnownMathPropertyHandlerFunction();

  it('should convert JS Math static properties that have Lua equivalents', () => {
    const given = Babel.memberExpression(
      Babel.identifier('Math'),
      Babel.identifier('PI')
    );

    const expected = memberExpression(
      identifier('math'),
      '.',
      identifier('pi')
    );

    expect(handleKnownMathProperties(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Math static properties using index expressions', () => {
    const given = Babel.memberExpression(
      Babel.identifier('Math'),
      Babel.stringLiteral('PI'),
      true
    );

    const expected = memberExpression(
      identifier('math'),
      '.',
      identifier('pi')
    );

    expect(handleKnownMathProperties(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Math properties that DO NOT exist on the JS Math Object assuming they have been shadowed/implemented', () => {
    const given = Babel.memberExpression(
      Babel.identifier('Math'),
      Babel.identifier('bar')
    );

    const expected = undefined;

    expect(handleKnownMathProperties(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Math properties (as index expression) that DO NOT exist on the JS Math Object assuming they have been shadowed/implemented', () => {
    const given = Babel.memberExpression(
      Babel.identifier('Math'),
      Babel.stringLiteral('bar'),
      true
    );

    const expected = undefined;

    expect(handleKnownMathProperties(source, {}, given)).toEqual(expected);
  });
});
