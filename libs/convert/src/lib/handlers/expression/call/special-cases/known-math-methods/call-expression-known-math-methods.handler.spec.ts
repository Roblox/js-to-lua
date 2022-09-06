import * as Babel from '@babel/types';
import {
  callExpression,
  identifier,
  memberExpression,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { testUtils } from '@js-to-lua/handler-utils';
import { createCallExpressionKnownMathMethodHandlerFunction } from './call-expression-known-math-methods.handler';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';

const source = '';

describe('Known Math methods', () => {
  const handleKnownMathMethods =
    createCallExpressionKnownMathMethodHandlerFunction(
      testUtils.mockNodeWithValueHandler
    );

  it('should convert JS Math static methods that have Lua equivalents', () => {
    const given = testUtils.withBabelComments(
      Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('Math'),
          Babel.identifier('ceil')
        ),
        [Babel.numericLiteral(10.45)]
      )
    );

    const expected = testUtils.withLuaComments(
      callExpression(
        memberExpression(identifier('math'), '.', identifier('ceil')),
        [mockNodeWithValue(numericLiteral(10.45))]
      )
    );

    expect(handleKnownMathMethods(source, {}, given)).toEqual(expected);
  });
  it('should convert JS Math static methods using index expressions', () => {
    const given = testUtils.withBabelComments(
      Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('Math'),
          Babel.stringLiteral('ceil'),
          true
        ),
        [Babel.numericLiteral(10.45)]
      )
    );

    const expected = testUtils.withLuaComments(
      callExpression(
        memberExpression(identifier('math'), '.', identifier('ceil')),
        [mockNodeWithValue(numericLiteral(10.45))]
      )
    );

    expect(handleKnownMathMethods(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Math methods that DO NOT exist on the JS Math Object assuming they have been shadowed/implemented', () => {
    const given = Babel.callExpression(
      Babel.memberExpression(Babel.identifier('Math'), Babel.identifier('foo')),
      [Babel.numericLiteral(10), Babel.numericLiteral(20)]
    );

    const expected = undefined;

    expect(handleKnownMathMethods(source, {}, given)).toEqual(expected);
  });
  it('should convert JS Math methods (as index expression) that DO NOT exist on the JS Math Object assuming they have been shadowed/implemented', () => {
    const given = Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('Math'),
        Babel.stringLiteral('foo'),
        true
      ),
      [Babel.numericLiteral(10), Babel.numericLiteral(20)]
    );

    const expected = undefined;

    expect(handleKnownMathMethods(source, {}, given)).toEqual(expected);
  });
});
