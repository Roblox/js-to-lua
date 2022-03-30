import {
  Expression,
  identifier as babelIdentifier,
  isIdentifier as isBabelIdentifier,
  optionalMemberExpression as babelOptionalMemberExpression,
} from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  indexExpression,
  LuaExpression,
  memberExpression,
  nilLiteral,
  stringLiteral,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  withLocation,
} from '@js-to-lua/lua-types/test-utils';
import { createOptionalMemberExpressionHandler } from './optional-member-expression.handler';

const { mockNodeWithValueHandler } = testUtils;

const expressionHandler = jest.fn();
const optionalMemberExpressionHandler = createOptionalMemberExpressionHandler(
  createHandlerFunction<LuaExpression, Expression>(
    (source, config, node) =>
      expressionHandler(source, config, node) as LuaExpression
  )
).handler;

describe('OptionalMemberExpression handler', () => {
  const source = '';

  beforeEach(() => {
    expressionHandler.mockReset();
    expressionHandler.mockImplementation(mockNodeWithValueHandler);
  });

  it('should handle basic optional member expression and right side result is an identifier', () => {
    expressionHandler.mockImplementation((source, config, node) =>
      isBabelIdentifier(node)
        ? identifier(node.name)
        : mockNodeWithValueHandler(source, config, node)
    );

    const given = babelOptionalMemberExpression(
      babelIdentifier('foo'),
      babelIdentifier('bar'),
      false,
      true
    );

    const expected = ifElseExpression(
      ifExpressionClause(
        binaryExpression(
          callExpression(identifier('typeof'), [identifier('foo')]),
          '==',
          stringLiteral('table')
        ),
        memberExpression(identifier('foo'), '.', identifier('bar'))
      ),
      elseExpressionClause(nilLiteral())
    );

    expect(optionalMemberExpressionHandler(source, {}, given)).toEqual(
      expected
    );
  });

  it('should handle basic optional member expression and right side result is NOT an identifier', () => {
    const given = babelOptionalMemberExpression(
      babelIdentifier('foo'),
      babelIdentifier('bar'),
      false,
      true
    );

    const expected = ifElseExpression(
      ifExpressionClause(
        binaryExpression(
          callExpression(identifier('typeof'), [
            mockNodeWithValue(babelIdentifier('foo')),
          ]),
          '==',
          stringLiteral('table')
        ),
        indexExpression(
          mockNodeWithValue(babelIdentifier('foo')),
          mockNodeWithValue(babelIdentifier('bar'))
        )
      ),
      elseExpressionClause(nilLiteral())
    );

    expect(optionalMemberExpressionHandler(source, {}, given)).toEqual(
      expected
    );
  });

  it('should handle computed optional member expression', () => {
    expressionHandler.mockImplementation((source, config, node) =>
      isBabelIdentifier(node)
        ? identifier(node.name)
        : mockNodeWithValueHandler(source, config, node)
    );

    const given = babelOptionalMemberExpression(
      babelIdentifier('foo'),
      babelIdentifier('bar'),
      true,
      true
    );

    const expected = ifElseExpression(
      ifExpressionClause(
        binaryExpression(
          callExpression(identifier('typeof'), [identifier('foo')]),
          '==',
          stringLiteral('table')
        ),
        indexExpression(identifier('foo'), identifier('bar'))
      ),
      elseExpressionClause(nilLiteral())
    );

    expect(optionalMemberExpressionHandler(source, {}, given)).toEqual(
      expected
    );
  });

  it('should handle return unhandled expression when optional prop is false', () => {
    const source = 'const test = foo?.bar';

    const given = withLocation({
      start: 13,
      end: 21,
    })(
      babelOptionalMemberExpression(
        babelIdentifier('foo'),
        babelIdentifier('bar'),
        false,
        false
      )
    );

    const expected = withTrailingConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: OptionalMemberExpression when optional property is not true`,
      'foo?.bar'
    );

    expect(optionalMemberExpressionHandler(source, {}, given)).toEqual(
      expected
    );
  });
});
