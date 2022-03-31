import {
  BinaryExpression as BabelBinaryExpression,
  binaryExpression as babelBinaryExpression,
  identifier as babelIdentifier,
  stringLiteral as babelStringLiteral,
  unaryExpression as babelUnaryExpression,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  binaryExpression,
  LuaBinaryExpressionOperator,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createOptionalTypeOfObjectHandlerFunction } from './type-of-object.handler';

const { mockNodeWithValueHandler } = testUtils;
describe('Type of object handler', () => {
  const handler = createOptionalTypeOfObjectHandlerFunction(
    mockNodeWithValueHandler
  );

  const source = '';

  const operators: Array<{
    givenOperator: Extract<
      BabelBinaryExpression['operator'],
      '==' | '===' | '!=' | '!=='
    >;
    expectedOperator: Extract<LuaBinaryExpressionOperator, '==' | '~='>;
  }> = [
    {
      givenOperator: '==',
      expectedOperator: '==',
    },
    {
      givenOperator: '===',
      expectedOperator: '==',
    },
    {
      givenOperator: '!=',
      expectedOperator: '~=',
    },
    {
      givenOperator: '!==',
      expectedOperator: '~=',
    },
  ];

  it.each(operators)(
    'should handle $givenOperator operator when table string literal on the right',
    ({ givenOperator, expectedOperator }) => {
      const given = babelBinaryExpression(
        givenOperator,
        babelUnaryExpression('typeof', babelIdentifier('foo')),
        babelStringLiteral('object')
      ) as BabelBinaryExpression & { operator: typeof givenOperator };

      const expected = binaryExpression(
        mockNodeWithValue(
          babelUnaryExpression('typeof', babelIdentifier('foo'))
        ),
        expectedOperator,
        stringLiteral('table')
      );

      expect(handler(source, { operator: expectedOperator }, given)).toEqual(
        expected
      );
    }
  );

  it.each(operators)(
    'should handle $givenOperator operator when table string literal on the left',
    ({ givenOperator, expectedOperator }) => {
      const given = babelBinaryExpression(
        givenOperator,
        babelStringLiteral('object'),
        babelUnaryExpression('typeof', babelIdentifier('foo'))
      ) as BabelBinaryExpression & { operator: typeof givenOperator };

      const expected = binaryExpression(
        stringLiteral('table'),
        expectedOperator,
        mockNodeWithValue(
          babelUnaryExpression('typeof', babelIdentifier('foo'))
        )
      );

      expect(handler(source, { operator: expectedOperator }, given)).toEqual(
        expected
      );
    }
  );

  it.each(operators)(
    'should ignore $givenOperator operator when string literal on the left is NOT `object`',
    ({ givenOperator, expectedOperator }) => {
      const given = babelBinaryExpression(
        givenOperator,
        babelStringLiteral('not object'),
        babelUnaryExpression('typeof', babelIdentifier('foo'))
      ) as BabelBinaryExpression & { operator: typeof givenOperator };

      expect(handler(source, { operator: expectedOperator }, given)).toEqual(
        undefined
      );
    }
  );

  it.each(operators)(
    'should ignore $givenOperator operator when string literal on the right is NOT `object`',
    ({ givenOperator, expectedOperator }) => {
      const given = babelBinaryExpression(
        givenOperator,
        babelUnaryExpression('typeof', babelIdentifier('foo')),
        babelStringLiteral('not object')
      ) as BabelBinaryExpression & { operator: typeof givenOperator };

      expect(handler(source, { operator: expectedOperator }, given)).toEqual(
        undefined
      );
    }
  );

  it.each(operators)(
    'should ignore $givenOperator operator when string literal on the right is NOT typeof',
    ({ givenOperator, expectedOperator }) => {
      const given = babelBinaryExpression(
        givenOperator,
        babelStringLiteral('object'),
        babelUnaryExpression('!', babelIdentifier('foo'))
      ) as BabelBinaryExpression & { operator: typeof givenOperator };

      expect(handler(source, { operator: expectedOperator }, given)).toEqual(
        undefined
      );
    }
  );

  it.each(operators)(
    'should ignore $givenOperator operator when string literal on the left is NOT typeof',
    ({ givenOperator, expectedOperator }) => {
      const given = babelBinaryExpression(
        givenOperator,
        babelUnaryExpression('!', babelIdentifier('foo')),
        babelStringLiteral('object')
      ) as BabelBinaryExpression & { operator: typeof givenOperator };

      expect(handler(source, { operator: expectedOperator }, given)).toEqual(
        undefined
      );
    }
  );
});
