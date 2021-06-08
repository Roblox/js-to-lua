import { ArrayExpression, Expression } from '@babel/types';
import {
  LuaExpression,
  LuaTableConstructor,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { createArrayExpressionHandler } from './array-expression.handler';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler, createHandlerFunction } from '../types';

const mockNode = (): LuaExpression =>
  ({
    type: 'MockNode',
  } as any);

const source = '';

const handleArrayExpression = createArrayExpressionHandler((...args) =>
  combineHandlers<BaseNodeHandler<Expression, LuaExpression>>(
    [handleArrayExpression],
    createHandlerFunction(mockNode)
  ).handler(...args)
);

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Array Expression Handler', () => {
  it(`should return Lua Table Constructor Node with empty elements`, () => {
    const given: ArrayExpression = {
      ...DEFAULT_NODE,
      type: 'ArrayExpression',
      elements: [],
    };
    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [],
    };

    expect(handleArrayExpression.handler(source, given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with no literal elements`, () => {
    const given: ArrayExpression = {
      ...DEFAULT_NODE,
      type: 'ArrayExpression',
      elements: [
        {
          ...DEFAULT_NODE,
          type: 'BooleanLiteral',
          value: true,
        },
        {
          ...DEFAULT_NODE,
          type: 'NumericLiteral',
          value: 1,
        },
        {
          ...DEFAULT_NODE,
          type: 'StringLiteral',
          value: 'abc',
        },
      ],
    };
    const expected: LuaTableConstructor = tableConstructor([
      tableNoKeyField(mockNode()),
      tableNoKeyField(mockNode()),
      tableNoKeyField(mockNode()),
    ]);

    expect(handleArrayExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle array of arrays`, () => {
    const given: ArrayExpression = {
      ...DEFAULT_NODE,
      type: 'ArrayExpression',
      elements: [
        {
          ...DEFAULT_NODE,
          type: 'ArrayExpression',
          elements: [],
        },
        {
          ...DEFAULT_NODE,
          type: 'ArrayExpression',
          elements: [],
        },
      ],
    };
    const expected: LuaTableConstructor = tableConstructor([
      tableNoKeyField(tableConstructor()),
      tableNoKeyField(tableConstructor()),
    ]);

    expect(handleArrayExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle deeply nested arrays`, () => {
    const given: ArrayExpression = {
      ...DEFAULT_NODE,
      type: 'ArrayExpression',
      elements: [
        {
          ...DEFAULT_NODE,
          type: 'ArrayExpression',
          elements: [
            {
              ...DEFAULT_NODE,
              type: 'ArrayExpression',
              elements: [
                {
                  ...DEFAULT_NODE,
                  type: 'ArrayExpression',
                  elements: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const expected: LuaTableConstructor = tableConstructor([
      tableNoKeyField(
        tableConstructor([
          tableNoKeyField(
            tableConstructor([tableNoKeyField(tableConstructor())])
          ),
        ])
      ),
    ]);

    expect(handleArrayExpression.handler(source, given)).toEqual(expected);
  });
});
