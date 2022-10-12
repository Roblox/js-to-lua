import * as Babel from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  luaNumberPolyfillName,
  withPolyfillExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createCallExpressionHandler } from '../call-expression.handler';
import { createCallExpressionKnownNumberMethodHandlerFunction } from './call-expression-known-number-methods.handler';

const source = '';

const { withBabelComments, withLuaComments, mockNodeWithValueHandler } =
  testUtils;

describe('Known Number methods', () => {
  const handleKnownNumberMethods =
    createCallExpressionKnownNumberMethodHandlerFunction(
      mockNodeWithValueHandler
    );

  it('should convert JS Number static methods that have Luau polyfill', () => {
    const given = Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('isNaN')
      ),
      [Babel.numericLiteral(10.45)]
    );

    const expected = withPolyfillExtra(luaNumberPolyfillName)(
      callExpression(
        memberExpression(identifier('Number'), '.', identifier('isNaN')),
        [mockNodeWithValue(numericLiteral(10.45))]
      )
    );

    const actual = handleKnownNumberMethods(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should convert JS Number static methods using index expressions', () => {
    const given = Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('isNaN'),
        true
      ),
      [Babel.numericLiteral(10.45)]
    );

    const expected = withPolyfillExtra(luaNumberPolyfillName)(
      callExpression(
        memberExpression(identifier('Number'), '.', identifier('isNaN')),
        [mockNodeWithValue(numericLiteral(10.45))]
      )
    );

    const actual = handleKnownNumberMethods(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should convert JS Number methods that DO NOT exist on the JS Number Object assuming they have been shadowed/implemented', () => {
    const given = Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('foo')
      ),
      [Babel.numericLiteral(10), Babel.numericLiteral(20)]
    );

    const expected = undefined;

    const actual = handleKnownNumberMethods(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should convert JS Number methods (as index expression) that DO NOT exist on the JS Number Object assuming they have been shadowed/implemented', () => {
    const given = Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('foo'),
        true
      ),
      [Babel.numericLiteral(10), Babel.numericLiteral(20)]
    );

    const expected = undefined;

    const actual = handleKnownNumberMethods(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it("should NOT convert JS Number methods that can't be recognised", () => {
    const given = Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.callExpression(Babel.identifier('bar'), []),
        true
      ),
      []
    );

    const expected = undefined;

    expect(handleKnownNumberMethods(source, {}, given)).toEqual(expected);
  });

  it.each([
    Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('NotNumber'),
        Babel.identifier('NaN')
      ),
      []
    ),
    Babel.callExpression(
      Babel.memberExpression(
        Babel.callExpression(Babel.identifier('NotNumber'), []),
        Babel.identifier('NaN')
      ),
      []
    ),
    Babel.callExpression(Babel.identifier('NotAMemberExpression'), []),
  ])(
    "should NOT convert a property that doesn't have Number as base",
    (given) => {
      const expected = undefined;

      expect(handleKnownNumberMethods(source, {}, given)).toEqual(expected);
    }
  );
});

describe('Call expression handler', () => {
  describe('Known Number methods - with comments', () => {
    const handleKnownNumberMethods = createCallExpressionHandler(
      mockNodeWithValueHandler
    ).handler;

    it('should convert JS Number static methods that have Luau polyfill and handle comments', () => {
      const given = withBabelComments(
        Babel.callExpression(
          Babel.memberExpression(
            Babel.identifier('Number'),
            Babel.identifier('isNaN')
          ),
          [Babel.numericLiteral(10.45)]
        )
      );

      const expected = withLuaComments(
        withPolyfillExtra(luaNumberPolyfillName)(
          callExpression(
            memberExpression(identifier('Number'), '.', identifier('isNaN')),
            [mockNodeWithValue(numericLiteral(10.45))]
          )
        )
      );

      const actual = handleKnownNumberMethods(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert JS Number static methods using index expressions and handle comments', () => {
      const given = withBabelComments(
        Babel.callExpression(
          Babel.memberExpression(
            Babel.identifier('Number'),
            Babel.stringLiteral('isNaN'),
            true
          ),
          [Babel.numericLiteral(10.45)]
        )
      );

      const expected = withLuaComments(
        withPolyfillExtra(luaNumberPolyfillName)(
          callExpression(
            memberExpression(identifier('Number'), '.', identifier('isNaN')),
            [mockNodeWithValue(numericLiteral(10.45))]
          )
        )
      );

      const actual = handleKnownNumberMethods(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});
