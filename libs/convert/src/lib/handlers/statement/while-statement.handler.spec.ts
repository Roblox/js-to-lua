import {
  blockStatement as babelBlockStatement,
  callExpression as babelCallExpression,
  Expression,
  expressionStatement as babelExpressionStatement,
  identifier as babelIdentifier,
  whileStatement as babelWhileStatement,
} from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  booleanInferableExpression,
  booleanMethod,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  LuaExpression,
  nodeGroup,
  whileStatement,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createWhileStatementHandler } from './while-statement.handler';

const handleWhileStatement = createWhileStatementHandler(
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler
);

const source = '';

describe('While statement Handler', () => {
  it(`should handle empty while`, () => {
    const given = babelWhileStatement(
      babelIdentifier('foo'),
      babelBlockStatement([])
    );

    const expected = whileStatement(
      callExpression(booleanMethod('toJSBoolean'), [
        mockNodeWithValue(babelIdentifier('foo')),
      ]),
      [nodeGroup([])]
    );

    expect(handleWhileStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle while with body`, () => {
    const given = babelWhileStatement(
      babelIdentifier('foo'),
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('func'), [])
        ),
      ])
    );

    const expected = whileStatement(
      callExpression(booleanMethod('toJSBoolean'), [
        mockNodeWithValue(babelIdentifier('foo')),
      ]),
      [
        nodeGroup([
          mockNodeWithValue(
            babelExpressionStatement(
              babelCallExpression(babelIdentifier('func'), [])
            )
          ),
        ]),
      ]
    );

    expect(handleWhileStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle empty while with boolean inferrable test`, () => {
    const handleWhileStatement = createWhileStatementHandler(
      createHandlerFunction<LuaExpression, Expression>((source, config, node) =>
        booleanInferableExpression(
          testUtils.mockNodeWithValueHandler(source, config, node)
        )
      ),
      testUtils.mockNodeWithValueHandler
    );

    const given = babelWhileStatement(
      babelIdentifier('foo'),
      babelBlockStatement([])
    );

    const expected = whileStatement(
      booleanInferableExpression(mockNodeWithValue(babelIdentifier('foo'))),
      [nodeGroup([])]
    );

    expect(handleWhileStatement.handler(source, {}, given)).toEqual(expected);
  });
});
