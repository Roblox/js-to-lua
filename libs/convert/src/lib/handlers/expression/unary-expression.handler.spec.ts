import {
  booleanLiteral as babelBooleanLiteral,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
  unaryExpression as babelUnaryExpression,
} from '@babel/types';
import {
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import {
  bit32Identifier,
  booleanMethod,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  functionExpression,
  identifier,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  returnStatement,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
} from '@js-to-lua/lua-types';
import { expressionHandler } from '../expression-statement.handler';
import {
  createUnaryExpressionAsStatementHandler,
  createUnaryExpressionHandler,
} from './unary-expression.handler';

const source = '';

describe('Unary Expression Handler', () => {
  describe('default', () => {
    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => expressionHandler)
    );

    it(`should handle typeof operator`, () => {
      const given = babelUnaryExpression(
        'typeof',
        babelIdentifier('foo'),
        true
      );

      const expected = callExpression(identifier('typeof'), [
        identifier('foo'),
      ]);

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle plus operator`, () => {
      const given = babelUnaryExpression('+', babelIdentifier('foo'), true);

      const expected = callExpression(identifier('tonumber'), [
        identifier('foo'),
      ]);

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle minus operator`, () => {
      const given = babelUnaryExpression('-', babelIdentifier('foo'), true);

      const expected = unaryExpression('-', identifier('foo'));

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator`, () => {
      const given = babelUnaryExpression('void', babelIdentifier('foo'), true);

      const expected = unaryVoidExpression(identifier('foo'));

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator with string literals`, () => {
      const given = babelUnaryExpression(
        'void',
        babelStringLiteral('foo'),
        true
      );

      const expected = identifier('nil');

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator with numeric literals`, () => {
      const given = babelUnaryExpression('void', babelNumericLiteral(0), true);

      const expected = identifier('nil');

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator with boolean literals`, () => {
      const given = babelUnaryExpression(
        'void',
        babelBooleanLiteral(false),
        true
      );

      const expected = identifier('nil');

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle negation operator`, () => {
      const given = babelUnaryExpression('!', babelIdentifier('foo'), true);

      const expected = unaryNegationExpression(
        callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle negation operator of BooleanLiteral`, () => {
      const given = babelUnaryExpression('!', babelBooleanLiteral(true), true);

      const expected = unaryNegationExpression(booleanLiteral(true));

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle double negation operator`, () => {
      const given = babelUnaryExpression(
        '!',
        babelUnaryExpression('!', babelIdentifier('foo'), true),
        true
      );

      const expected = unaryNegationExpression(
        unaryNegationExpression(
          callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
        )
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle delete operator`, () => {
      const given = babelUnaryExpression(
        'delete',
        babelIdentifier('foo'),
        true
      );

      const expected = callExpression(
        functionExpression(
          [],
          nodeGroup([
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [nilLiteral()]
            ),
            returnStatement(booleanLiteral(true)),
          ])
        ),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle ~ operator`, () => {
      const given = babelUnaryExpression('~', babelNumericLiteral(5), true);

      const expected = withTrailingConversionComment(
        callExpression(
          memberExpression(bit32Identifier(), '.', identifier('bnot')),
          [numericLiteral(5)]
        ),
        'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });
  describe('as statement', () => {
    const handleUnaryExpression = createUnaryExpressionAsStatementHandler(
      forwardHandlerRef(() => expressionHandler)
    );

    it(`should handle typeof operator`, () => {
      const given = babelUnaryExpression(
        'typeof',
        babelIdentifier('foo'),
        true
      );

      const expected = asStatementReturnTypeInline(
        [],
        callExpression(identifier('typeof'), [identifier('foo')]),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle plus operator`, () => {
      const given = babelUnaryExpression('+', babelIdentifier('foo'), true);

      const expected = asStatementReturnTypeInline(
        [],
        callExpression(identifier('tonumber'), [identifier('foo')]),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle minus operator`, () => {
      const given = babelUnaryExpression('-', babelIdentifier('foo'), true);

      const expected = asStatementReturnTypeInline(
        [],
        unaryExpression('-', identifier('foo')),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator`, () => {
      const given = babelUnaryExpression('void', babelIdentifier('foo'), true);

      const expected = asStatementReturnTypeInline(
        [],
        unaryVoidExpression(identifier('foo')),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator with string literals`, () => {
      const given = babelUnaryExpression(
        'void',
        babelStringLiteral('foo'),
        true
      );

      const expected = asStatementReturnTypeInline([], identifier('nil'), []);

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator with numeric literals`, () => {
      const given = babelUnaryExpression('void', babelNumericLiteral(0), true);

      const expected = asStatementReturnTypeInline([], identifier('nil'), []);

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle void operator with boolean literals`, () => {
      const given = babelUnaryExpression(
        'void',
        babelBooleanLiteral(false),
        true
      );

      const expected = asStatementReturnTypeInline([], identifier('nil'), []);

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle negation operator`, () => {
      const given = babelUnaryExpression('!', babelIdentifier('foo'), true);

      const expected = asStatementReturnTypeInline(
        [],
        unaryNegationExpression(
          callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
        ),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle negation operator of BooleanLiteral`, () => {
      const given = babelUnaryExpression('!', babelBooleanLiteral(true), true);

      const expected = asStatementReturnTypeInline(
        [],
        unaryNegationExpression(booleanLiteral(true)),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle double negation operator`, () => {
      const given = babelUnaryExpression(
        '!',
        babelUnaryExpression('!', babelIdentifier('foo'), true),
        true
      );

      const expected = asStatementReturnTypeInline(
        [],
        unaryNegationExpression(
          unaryNegationExpression(
            callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
          )
        ),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle delete operator`, () => {
      const given = babelUnaryExpression(
        'delete',
        babelIdentifier('foo'),
        true
      );

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [nilLiteral()]
          ),
        ],
        [],
        booleanLiteral(true)
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle ~ operator`, () => {
      const given = babelUnaryExpression('~', babelNumericLiteral(5), true);

      const expected = asStatementReturnTypeInline(
        [],
        withTrailingConversionComment(
          callExpression(
            memberExpression(bit32Identifier(), '.', identifier('bnot')),
            [numericLiteral(5)]
          ),
          'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
        ),
        []
      );

      expect(handleUnaryExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });
});
