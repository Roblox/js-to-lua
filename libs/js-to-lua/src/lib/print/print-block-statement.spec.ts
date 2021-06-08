import { LuaBlockStatement } from '@js-to-lua/lua-types';
import { printBlockStatement } from './print-node';

describe('Print Block Statement', () => {
  it(`should print Block Statement Node with body`, () => {
    const given: LuaBlockStatement = {
      type: 'BlockStatement',
      body: [],
    };
    const expected = `do
end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print Block Statement Node with expressions`, () => {
    const given: LuaBlockStatement = {
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

    const expected = `do
  "hello"
  1
end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print nested block statements`, () => {
    const given: LuaBlockStatement = {
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

    const expected = `do
  local name = "wole"
  do
  "roblox"
  1
end
end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print deeply nested block statements`, () => {
    const given: LuaBlockStatement = {
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
        },
      ],
    };
    const expected = `do
  local name = "wole"
  do
  "roblox"
  1
  do
  1
end
end
end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });
});
