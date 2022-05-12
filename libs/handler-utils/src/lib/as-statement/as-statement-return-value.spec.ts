import {
  callExpression,
  expressionStatement,
  identifier,
} from '@js-to-lua/lua-types';
import {
  asStatementReturnTypeInline,
  AsStatementReturnTypeInline,
} from './return-type-inline';
import {
  asStatementReturnTypeWithIdentifier,
  AsStatementReturnTypeWithIdentifiers,
} from './return-type-with-identifiers';

describe('As statement return value creators', () => {
  it('should create an inline as statement return value', () => {
    expect(
      asStatementReturnTypeInline(
        [expressionStatement(callExpression(identifier('preFoo'), []))],
        identifier('foo'),
        [expressionStatement(callExpression(identifier('postFoo'), []))]
      )
    ).toEqual({
      type: 'INLINE',
      preStatements: [
        expressionStatement(callExpression(identifier('preFoo'), [])),
      ],
      postStatements: [
        expressionStatement(callExpression(identifier('postFoo'), [])),
      ],
      inlineExpression: identifier('foo'),
    } as AsStatementReturnTypeInline);
  });

  it('should create an as statement return value with identifier', () => {
    expect(
      asStatementReturnTypeWithIdentifier(
        [expressionStatement(callExpression(identifier('preFoo'), []))],
        [expressionStatement(callExpression(identifier('postFoo'), []))],
        identifier('foo')
      )
    ).toEqual({
      type: 'IDENTIFIERS',
      preStatements: [
        expressionStatement(callExpression(identifier('preFoo'), [])),
      ],
      postStatements: [
        expressionStatement(callExpression(identifier('postFoo'), [])),
      ],
      identifiers: [identifier('foo')],
    } as AsStatementReturnTypeWithIdentifiers);
  });
});
