import * as Babel from '@babel/types';
import {
  withPolyfillExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  memberExpression,
  unaryExpression,
} from '@js-to-lua/lua-types';
import { createMemberExpressionKnownNumberPropertyHandlerFunction } from './member-expression-known-number-properties.handler';

const source = '';

describe('Known Number methods', () => {
  const handleKnownNumberProperties =
    createMemberExpressionKnownNumberPropertyHandlerFunction();

  it.each([
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('POSITIVE_INFINITY')
      ),
      expected: memberExpression(identifier('math'), '.', identifier('huge')),
    },
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('NEGATIVE_INFINITY')
      ),
      expected: unaryExpression(
        '-',
        memberExpression(identifier('math'), '.', identifier('huge'))
      ),
    },
  ])(
    'should convert JS Number static properties that have Lua equivalents',
    ({ given, expected }) => {
      expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
    }
  );

  it.each([
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('POSITIVE_INFINITY'),
        true
      ),
      expected: memberExpression(identifier('math'), '.', identifier('huge')),
    },
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('NEGATIVE_INFINITY'),
        true
      ),
      expected: unaryExpression(
        '-',
        memberExpression(identifier('math'), '.', identifier('huge'))
      ),
    },
  ])(
    'should convert JS Number static properties that have Lua equivalents - using index expressions',
    ({ given, expected }) => {
      expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
    }
  );

  it.each([
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('NaN')
      ),
      expected: withPolyfillExtra('Number')(
        memberExpression(identifier('Number'), '.', identifier('NaN'))
      ),
    },
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('MAX_SAFE_INTEGER')
      ),
      expected: withPolyfillExtra('Number')(
        memberExpression(
          identifier('Number'),
          '.',
          identifier('MAX_SAFE_INTEGER')
        )
      ),
    },
  ])(
    'should convert JS Number static property that have Luau polyfill',
    ({ given, expected }) => {
      expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
    }
  );

  it.each([
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('NaN'),
        true
      ),
      expected: withPolyfillExtra('Number')(
        memberExpression(identifier('Number'), '.', identifier('NaN'))
      ),
    },
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('MAX_SAFE_INTEGER'),
        true
      ),
      expected: withPolyfillExtra('Number')(
        memberExpression(
          identifier('Number'),
          '.',
          identifier('MAX_SAFE_INTEGER')
        )
      ),
    },
  ])(
    'should convert JS Number static properties that have Luau polyfill - using index expressions',
    ({ given, expected }) => {
      expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
    }
  );

  it.each([
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('NaN')
      ),
      expected: withPolyfillExtra('Number')(
        memberExpression(identifier('Number'), '.', identifier('NaN'))
      ),
    },
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.identifier('MAX_SAFE_INTEGER')
      ),
      expected: withPolyfillExtra('Number')(
        memberExpression(
          identifier('Number'),
          '.',
          identifier('MAX_SAFE_INTEGER')
        )
      ),
    },
  ])(
    'should convert JS Number static property that have MISSING Luau polyfill',
    ({ given, expected }) => {
      expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
    }
  );

  it.each([
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('parseFloat'),
        true
      ),
      expected: withTrailingConversionComment(
        withPolyfillExtra('Number')(
          memberExpression(identifier('Number'), '.', identifier('parseFloat'))
        ),
        'ROBLOX NOTE: Number.parseFloat is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same'
      ),
    },
    {
      given: Babel.memberExpression(
        Babel.identifier('Number'),
        Babel.stringLiteral('parseInt'),
        true
      ),
      expected: withTrailingConversionComment(
        withPolyfillExtra('Number')(
          memberExpression(identifier('Number'), '.', identifier('parseInt'))
        ),
        'ROBLOX NOTE: Number.parseInt is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same'
      ),
    },
  ])(
    'should convert JS Number static properties that have MISSING Luau polyfill - using index expressions',
    ({ given, expected }) => {
      expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
    }
  );

  it('should NOT convert JS Number properties that DO NOT exist on the JS Number Object', () => {
    const given = Babel.memberExpression(
      Babel.identifier('Number'),
      Babel.identifier('bar')
    );

    const expected = undefined;

    expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
  });

  it('should NOT convert JS Number properties (as index expression) that DO NOT exist on the JS Number Object', () => {
    const given = Babel.memberExpression(
      Babel.identifier('Number'),
      Babel.stringLiteral('bar'),
      true
    );

    const expected = undefined;

    expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
  });

  it("should NOT convert JS Number property that can't be recognised", () => {
    const given = Babel.memberExpression(
      Babel.identifier('Number'),
      Babel.callExpression(Babel.identifier('bar'), []),
      true
    );

    const expected = undefined;

    expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
  });

  it.each([
    Babel.memberExpression(
      Babel.identifier('NotNumber'),
      Babel.identifier('NaN')
    ),
    Babel.memberExpression(
      Babel.callExpression(Babel.identifier('NotNumber'), []),
      Babel.identifier('NaN')
    ),
  ])(
    "should NOT convert a property that doesn't have Number as base",
    (given) => {
      const expected = undefined;

      expect(handleKnownNumberProperties(source, {}, given)).toEqual(expected);
    }
  );
});
