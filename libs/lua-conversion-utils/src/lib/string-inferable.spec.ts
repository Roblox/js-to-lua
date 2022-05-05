import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  elseifExpressionClause,
  identifier,
  ifElseExpression,
  ifExpression,
  ifExpressionClause,
  LuaBinaryExpressionOperator,
  LuaExpression,
  multilineStringLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import {
  isStringInferable,
  stringInferableExpression,
} from './string-inferable';

describe('stringInferable', () => {
  it.each(stringInferableExpressions())(
    'should return true for case [%#]: %s',
    (node) => {
      expect(isStringInferable(node)).toBe(true);
    }
  );

  it.each(notStringInferableExpressions())(
    'should return false for case [%#]: %s',
    (expression) => {
      expect(isStringInferable(expression)).toBe(false);
    }
  );
});

function stringInferableExpressions(): LuaExpression[] {
  return [
    stringLiteral('foo'),
    stringLiteral('bar'),
    multilineStringLiteral('foo'),
    multilineStringLiteral('foo\nbar'),
    binaryExpression(stringLiteral('foo'), '..', stringLiteral('bar')),
    binaryExpression(identifier('foo'), '..', stringLiteral('bar')),
    binaryExpression(stringLiteral('foo'), '..', identifier('bar')),
    binaryExpression(identifier('foo'), '..', identifier('bar')),
    ifElseExpression(
      ifExpressionClause(identifier('condition'), stringLiteral('foo')),
      elseExpressionClause(stringLiteral('bar'))
    ),
    ifExpression(
      ifExpressionClause(identifier('condition'), stringLiteral('foo')),
      [],
      elseExpressionClause(stringLiteral('bar'))
    ),
    ifExpression(
      ifExpressionClause(identifier('condition1'), stringLiteral('foo')),
      [
        elseifExpressionClause(identifier('condition2'), stringLiteral('bar')),
        elseifExpressionClause(
          identifier('condition3'),
          multilineStringLiteral('baz')
        ),
        elseifExpressionClause(
          identifier('condition4'),
          stringInferableExpression(identifier('fizz'))
        ),
        elseifExpressionClause(
          identifier('condition5'),
          ifElseExpression(
            ifExpressionClause(identifier('condition6'), stringLiteral('jazz')),
            elseExpressionClause(stringLiteral('fuzz'))
          )
        ),
      ],
      elseExpressionClause(stringLiteral('buzz'))
    ),
    stringInferableExpression(identifier('foo')),
    stringInferableExpression(callExpression(identifier('foo'), [])),
  ];
}

function notStringInferableExpressions(): LuaExpression[] {
  return [
    identifier('foo'),
    callExpression(identifier('bar'), []),
    ...Array<LuaBinaryExpressionOperator>(
      '+',
      '-',
      '/',
      '%',
      '^',
      '*',
      '>',
      '<',
      '>=',
      '<=',
      '==',
      '~='
    ).map((operator) =>
      binaryExpression(identifier('foo'), operator, identifier('bar'))
    ),
    ifElseExpression(
      ifExpressionClause(identifier('condition'), stringLiteral('foo')),
      // this is not string inferable
      elseExpressionClause(identifier('bar'))
    ),
    ifExpression(
      ifExpressionClause(identifier('condition'), stringLiteral('foo')),
      [],
      // this is not string inferable
      elseExpressionClause(identifier('bar'))
    ),
    ifExpression(
      ifExpressionClause(identifier('condition1'), stringLiteral('foo')),
      [
        elseifExpressionClause(identifier('condition2'), stringLiteral('bar')),
        elseifExpressionClause(
          identifier('condition3'),
          multilineStringLiteral('baz')
        ),
        elseifExpressionClause(
          identifier('condition4'),
          stringInferableExpression(identifier('fizz'))
        ),
        elseifExpressionClause(
          identifier('condition5'),
          ifElseExpression(
            ifExpressionClause(
              identifier('condition6'),
              // this is not string inferable
              identifier('jazz')
            ),
            elseExpressionClause(stringLiteral('fuzz'))
          )
        ),
      ],
      elseExpressionClause(stringLiteral('buzz'))
    ),
  ];
}
