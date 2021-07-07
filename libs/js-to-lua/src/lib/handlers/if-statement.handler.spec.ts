import {
  identifier as babelIdentifier,
  ifStatement as babelIfStatement,
  blockStatement as babelBlockStatement,
} from '@babel/types';
import {
  callExpression,
  booleanMethod,
  elseClause,
  elseifClause,
  identifier,
  ifClause,
  ifStatement,
} from '@js-to-lua/lua-types';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import {
  handleExpression,
  handleStatement,
} from './expression-statement.handler';
import { createIfStatementHandler } from './if-statement.handler';

const handleIfStatement = createIfStatementHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleStatement)
);

const source = '';

describe('If statement Handler', () => {
  it(`should handle if`, () => {
    const given = babelIfStatement(
      babelIdentifier('foo'),
      babelBlockStatement([])
    );

    const expected = ifStatement(
      ifClause(
        callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
        []
      )
    );

    expect(handleIfStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/else`, () => {
    const given = babelIfStatement(
      babelIdentifier('foo'),
      babelBlockStatement([]),
      babelBlockStatement([])
    );

    const expected = ifStatement(
      ifClause(
        callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
        []
      ),
      [],
      elseClause([])
    );

    expect(handleIfStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif`, () => {
    const given = babelIfStatement(
      babelIdentifier('foo'),
      babelBlockStatement([]),
      babelIfStatement(babelIdentifier('bar'), babelBlockStatement([]))
    );

    const expected = ifStatement(
      ifClause(
        callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
        []
      ),
      [
        elseifClause(
          callExpression(booleanMethod('toJSBoolean'), [identifier('bar')]),
          []
        ),
      ]
    );

    expect(handleIfStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif/else`, () => {
    const given = babelIfStatement(
      babelIdentifier('foo'),
      babelBlockStatement([]),
      babelIfStatement(
        babelIdentifier('bar'),
        babelBlockStatement([]),
        babelBlockStatement([])
      )
    );

    const expected = ifStatement(
      ifClause(
        callExpression(booleanMethod('toJSBoolean'), [identifier('foo')]),
        []
      ),
      [
        elseifClause(
          callExpression(booleanMethod('toJSBoolean'), [identifier('bar')]),
          []
        ),
      ],
      elseClause([])
    );

    expect(handleIfStatement.handler(source, {}, given)).toEqual(expected);
  });
});
