import { ArrayExpression } from '@babel/types';
import { LuaTableConstructor } from '../lua-nodes.types';
import { handleArrayExpression } from './expression-statement.handler';

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

    expect(handleArrayExpression.handler(given)).toEqual(expected);
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
    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [
        {
          type: 'TableNoKeyField',
          value: {
            type: 'BooleanLiteral',
            value: true,
          },
        },
        {
          type: 'TableNoKeyField',
          value: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
        {
          type: 'TableNoKeyField',
          value: {
            type: 'StringLiteral',
            value: 'abc',
          },
        },
      ],
    };

    expect(handleArrayExpression.handler(given)).toEqual(expected);
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
    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [
        {
          type: 'TableNoKeyField',
          value: {
            type: 'TableConstructor',
            elements: [],
          },
        },
        {
          type: 'TableNoKeyField',
          value: {
            type: 'TableConstructor',
            elements: [],
          },
        },
      ],
    };

    expect(handleArrayExpression.handler(given)).toEqual(expected);
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
    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [
        {
          type: 'TableNoKeyField',
          value: {
            type: 'TableConstructor',
            elements: [
              {
                type: 'TableNoKeyField',
                value: {
                  type: 'TableConstructor',
                  elements: [
                    {
                      type: 'TableNoKeyField',
                      value: {
                        type: 'TableConstructor',
                        elements: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };

    expect(handleArrayExpression.handler(given)).toEqual(expected);
  });
});
