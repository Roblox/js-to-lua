import { BlockStatement } from '@babel/types';
import { LuaBlockStatement } from '../lua-nodes.types';
import { handleStatement } from './statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Block Statement Handler', () => {
  it(`should return Empty Lua Block Node with empty body`, () => {
    const given: BlockStatement = {
      ...DEFAULT_NODE,
      type: 'BlockStatement',
      body: [],
      directives: [],
    };
    const expected: LuaBlockStatement = {
      type: 'BlockStatement',
      body: [],
    };

    expect(handleStatement.handler(given)).toEqual(expected);
  });

  it(`should return Lua Block Constructor Node with expressions`, () => {
    const given: BlockStatement = {
      ...DEFAULT_NODE,
      type: 'BlockStatement',
      body: [
        {
          ...DEFAULT_NODE,
          type: 'ExpressionStatement',
          expression: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'hello',
          },
        },
        {
          ...DEFAULT_NODE,
          type: 'ExpressionStatement',
          expression: {
            ...DEFAULT_NODE,
            type: 'NumericLiteral',
            extra: {
              raw: '1',
            },
            value: 1,
          },
        },
      ],
      directives: [],
    };
    const expected: LuaBlockStatement = {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'StringLiteral',
            value: 'hello',
          },
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'NumericLiteral',
            extra: {
              raw: '1',
            },
            value: 1,
          },
        },
      ],
    };

    expect(handleStatement.handler(given)).toEqual(expected);
  });

  it(`should handle nested block statements`, () => {
    const given: BlockStatement = {
      ...DEFAULT_NODE,
      type: 'BlockStatement',
      body: [
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclaration',
          declarations: [
            {
              ...DEFAULT_NODE,
              type: 'VariableDeclarator',
              id: {
                ...DEFAULT_NODE,
                type: 'Identifier',
                name: 'name',
              },
              init: {
                ...DEFAULT_NODE,
                type: 'StringLiteral',
                value: 'wole',
              },
            },
          ],
          kind: 'const',
        },
        {
          ...DEFAULT_NODE,
          type: 'BlockStatement',
          body: [
            {
              ...DEFAULT_NODE,
              type: 'ExpressionStatement',
              expression: {
                ...DEFAULT_NODE,
                type: 'StringLiteral',
                value: 'roblox',
              },
            },
            {
              ...DEFAULT_NODE,
              type: 'ExpressionStatement',
              expression: {
                ...DEFAULT_NODE,
                type: 'NumericLiteral',
                extra: {
                  raw: '1',
                },
                value: 1,
              },
            },
          ],
          directives: [],
        },
      ],
      directives: [],
    };

    const expected: LuaBlockStatement = {
      type: 'BlockStatement',
      body: [
        {
          type: 'VariableDeclaration',
          identifiers: [
            {
              type: 'VariableDeclaratorIdentifier',
              value: {
                type: 'Identifier',
                name: 'name',
              },
            },
          ],
          values: [
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'wole',
              },
            },
          ],
        },
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'StringLiteral',
                value: 'roblox',
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 1,
                extra: {
                  raw: '1',
                },
              },
            },
          ],
        },
      ],
    };

    expect(handleStatement.handler(given)).toEqual(expected);
  });

  it(`should handle deeply nested block statements`, () => {
    const given: BlockStatement = {
      ...DEFAULT_NODE,
      type: 'BlockStatement',
      body: [
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclaration',
          declarations: [
            {
              ...DEFAULT_NODE,
              type: 'VariableDeclarator',
              id: {
                ...DEFAULT_NODE,
                type: 'Identifier',
                name: 'name',
              },
              init: {
                ...DEFAULT_NODE,
                type: 'StringLiteral',
                value: 'wole',
              },
            },
          ],
          kind: 'const',
        },
        {
          ...DEFAULT_NODE,
          type: 'BlockStatement',
          body: [
            {
              ...DEFAULT_NODE,
              type: 'ExpressionStatement',
              expression: {
                ...DEFAULT_NODE,
                type: 'StringLiteral',
                value: 'roblox',
              },
            },
            {
              ...DEFAULT_NODE,
              type: 'ExpressionStatement',
              expression: {
                ...DEFAULT_NODE,
                type: 'NumericLiteral',
                extra: {
                  raw: '1',
                },
                value: 1,
              },
            },
            {
              ...DEFAULT_NODE,
              type: 'BlockStatement',
              body: [
                {
                  ...DEFAULT_NODE,
                  type: 'ExpressionStatement',
                  expression: {
                    ...DEFAULT_NODE,
                    type: 'StringLiteral',
                    value: 'roblox',
                  },
                },
              ],
              directives: [],
            },
          ],
          directives: [],
        },
      ],
      directives: [],
    };

    const expected: LuaBlockStatement = {
      type: 'BlockStatement',
      body: [
        {
          type: 'VariableDeclaration',
          identifiers: [
            {
              type: 'VariableDeclaratorIdentifier',
              value: {
                type: 'Identifier',
                name: 'name',
              },
            },
          ],
          values: [
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'wole',
              },
            },
          ],
        },
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'StringLiteral',
                value: 'roblox',
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 1,
                extra: {
                  raw: '1',
                },
              },
            },
            {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'StringLiteral',
                    value: 'roblox',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    expect(handleStatement.handler(given)).toEqual(expected);
  });
});
