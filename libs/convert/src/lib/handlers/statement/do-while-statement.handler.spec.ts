import {
  blockStatement as babelBlockStatement,
  callExpression as babelCallExpression,
  doWhileStatement as babelDoWhileStatement,
  Expression,
  expressionStatement as babelExpressionStatement,
  identifier as babelIdentifier,
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
  repeatStatement,
  unaryNegationExpression,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createDoWhileStatementHandler } from './do-while-statement.handler';

const handleDoWhileStatement = createDoWhileStatementHandler(
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler
);

const source = '';

describe('While statement Handler', () => {
  it(`should handle empty while`, () => {
    const given = babelDoWhileStatement(
      babelIdentifier('foo'),
      babelBlockStatement([])
    );

    const expected = repeatStatement(
      unaryNegationExpression(
        callExpression(booleanMethod('toJSBoolean'), [
          mockNodeWithValue(babelIdentifier('foo')),
        ])
      ),
      [nodeGroup([])]
    );

    expect(handleDoWhileStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle while with body`, () => {
    const given = babelDoWhileStatement(
      babelIdentifier('foo'),
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('func'), [])
        ),
      ])
    );

    const expected = repeatStatement(
      unaryNegationExpression(
        callExpression(booleanMethod('toJSBoolean'), [
          mockNodeWithValue(babelIdentifier('foo')),
        ])
      ),
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

    expect(handleDoWhileStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle empty while with boolean inferrable test`, () => {
    const handleDoWhileStatement = createDoWhileStatementHandler(
      createHandlerFunction<LuaExpression, Expression>((source, config, node) =>
        booleanInferableExpression(
          testUtils.mockNodeWithValueHandler(source, config, node)
        )
      ),
      testUtils.mockNodeWithValueHandler
    );

    const given = babelDoWhileStatement(
      babelIdentifier('foo'),
      babelBlockStatement([])
    );

    const expected = repeatStatement(
      unaryNegationExpression(
        booleanInferableExpression(mockNodeWithValue(babelIdentifier('foo')))
      ),
      [nodeGroup([])]
    );

    expect(handleDoWhileStatement.handler(source, {}, given)).toEqual(expected);
  });
});
