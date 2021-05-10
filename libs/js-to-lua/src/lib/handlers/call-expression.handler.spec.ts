import { CallExpression } from '@babel/types';
import { LuaCallExpression } from '../lua-nodes.types';
import { handleCallExpression } from './expression-statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Call Expression Handler', () => {
  it(`should return Call with no parameters`, () => {
    const given: CallExpression = {
      ...DEFAULT_NODE,
      type: 'CallExpression',
      callee: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'Symbol',
      },
      arguments: [],
    };

    const expected: LuaCallExpression = {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'Symbol',
      },
      arguments: [],
    };

    expect(handleCallExpression.handler(given)).toEqual(expected);
  });
  it(`should return Call with parameters`, () => {
    const given: CallExpression = {
      ...DEFAULT_NODE,
      type: 'CallExpression',
      callee: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'test',
      },
      arguments: [
        {
          ...DEFAULT_NODE,
          type: 'NumericLiteral',
          extra: {
            ...DEFAULT_NODE,
            rawValue: 5,
            raw: '5',
          },
          value: 5,
        },
        {
          ...DEFAULT_NODE,
          type: 'StringLiteral',
          value: 'wole',
        },
      ],
    };

    const expected: LuaCallExpression = {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'test',
      },
      arguments: [
        {
          type: 'NumericLiteral',
          extra: {
            raw: '5',
          },
          value: 5,
        },
        {
          type: 'StringLiteral',
          value: 'wole',
        },
      ],
    };

    expect(handleCallExpression.handler(given)).toEqual(expected);
  });
});
