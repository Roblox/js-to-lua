import {
  ArrayExpression,
  arrayExpression as babelArrayExpression,
  booleanLiteral as babelBooleanLiteral,
  Expression,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  combineHandlers,
  createHandlerFunction,
  testUtils,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaTableConstructor,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import { createArrayExpressionHandler } from './array-expression.handler';

const source = '';

const handleArrayExpression = createArrayExpressionHandler(
  createHandlerFunction((...args) =>
    combineHandlers<LuaExpression, Expression>(
      [handleArrayExpression],
      testUtils.mockNodeHandler
    ).handler(...args)
  )
);

describe('Array Expression Handler', () => {
  it(`should return Lua Table Constructor Node with empty elements`, () => {
    const given = babelArrayExpression();

    const expected: LuaTableConstructor = tableConstructor();

    expect(handleArrayExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with no literal elements`, () => {
    const given = babelArrayExpression([
      babelBooleanLiteral(true),
      babelNumericLiteral(1),
      babelStringLiteral('abc'),
    ]);

    const expected: LuaTableConstructor = tableConstructor([
      tableNoKeyField(mockNode()),
      tableNoKeyField(mockNode()),
      tableNoKeyField(mockNode()),
    ]);

    expect(handleArrayExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle array of arrays`, () => {
    const given: ArrayExpression = babelArrayExpression([
      babelArrayExpression(),
      babelArrayExpression(),
    ]);

    const expected: LuaTableConstructor = tableConstructor([
      tableNoKeyField(tableConstructor()),
      tableNoKeyField(tableConstructor()),
    ]);

    expect(handleArrayExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle deeply nested arrays`, () => {
    const given: ArrayExpression = babelArrayExpression([
      babelArrayExpression([babelArrayExpression([babelArrayExpression()])]),
    ]);

    const expected: LuaTableConstructor = tableConstructor([
      tableNoKeyField(
        tableConstructor([
          tableNoKeyField(
            tableConstructor([tableNoKeyField(tableConstructor())])
          ),
        ])
      ),
    ]);

    expect(handleArrayExpression.handler(source, {}, given)).toEqual(expected);
  });
});
