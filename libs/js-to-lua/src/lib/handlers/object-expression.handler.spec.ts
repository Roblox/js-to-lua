import { ObjectExpression } from '@babel/types';
import { LuaTableConstructor } from '@js-to-lua/lua-types';
import { handleObjectExpression } from './expression-statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Object Expression Handler', () => {
  it(`should return Lua Table Constructor Node with empty elements`, () => {
    const given: ObjectExpression = {
      ...DEFAULT_NODE,
      type: 'ObjectExpression',
      properties: [],
    };
    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [],
    };

    expect(handleObjectExpression.handler(given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with TableNameKeyField elements`, () => {
    const given: ObjectExpression = {
      ...DEFAULT_NODE,
      type: 'ObjectExpression',
      properties: [
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'foo',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'BooleanLiteral',
            value: true,
          },
          computed: false,
          shorthand: false,
        },
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'bar',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'NumericLiteral',
            value: 1,
          },
          computed: false,
          shorthand: false,
        },
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'baz',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'abc',
          },
          computed: false,
          shorthand: false,
        },
      ],
    };
    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [
        {
          type: 'TableNameKeyField',
          key: {
            type: 'Identifier',
            name: 'foo',
          },
          value: {
            type: 'BooleanLiteral',
            value: true,
          },
        },
        {
          type: 'TableNameKeyField',
          key: {
            type: 'Identifier',
            name: 'bar',
          },
          value: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
        {
          type: 'TableNameKeyField',
          key: {
            type: 'Identifier',
            name: 'baz',
          },
          value: {
            type: 'StringLiteral',
            value: 'abc',
          },
        },
      ],
    };

    expect(handleObjectExpression.handler(given)).toEqual(expected);
  });

  it(`should return Lua Table Constructor Node with TableExpressionKeyField elements`, () => {
    const given: ObjectExpression = {
      ...DEFAULT_NODE,
      type: 'ObjectExpression',
      properties: [
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'foo',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'BooleanLiteral',
            value: true,
          },
          computed: false,
          shorthand: false,
        },
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'bar',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'NumericLiteral',
            value: 1,
          },
          computed: false,
          shorthand: false,
        },
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'baz',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'abc',
          },
          computed: false,
          shorthand: false,
        },
      ],
    };
    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [
        {
          type: 'TableExpressionKeyField',
          key: {
            type: 'StringLiteral',
            value: 'foo',
          },
          value: {
            type: 'BooleanLiteral',
            value: true,
          },
        },
        {
          type: 'TableExpressionKeyField',
          key: {
            type: 'StringLiteral',
            value: 'bar',
          },
          value: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
        {
          type: 'TableExpressionKeyField',
          key: {
            type: 'StringLiteral',
            value: 'baz',
          },
          value: {
            type: 'StringLiteral',
            value: 'abc',
          },
        },
      ],
    };

    expect(handleObjectExpression.handler(given)).toEqual(expected);
  });

  it(`should handle object of objects`, () => {
    const given: ObjectExpression = {
      ...DEFAULT_NODE,
      type: 'ObjectExpression',
      properties: [
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'foo0',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'ObjectExpression',
            properties: [
              {
                ...DEFAULT_NODE,
                type: 'ObjectProperty',
                key: {
                  ...DEFAULT_NODE,
                  type: 'Identifier',
                  name: 'foo1',
                },
                value: {
                  ...DEFAULT_NODE,
                  type: 'BooleanLiteral',
                  value: true,
                },
                computed: false,
                shorthand: false,
              },
            ],
          },
          computed: false,
          shorthand: false,
        },
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'bar0',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'ObjectExpression',
            properties: [
              {
                ...DEFAULT_NODE,
                type: 'ObjectProperty',
                key: {
                  ...DEFAULT_NODE,
                  type: 'Identifier',
                  name: 'bar1',
                },
                value: {
                  ...DEFAULT_NODE,
                  type: 'NumericLiteral',
                  value: 1,
                },
                computed: false,
                shorthand: false,
              },
            ],
          },
          computed: false,
          shorthand: false,
        },
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'baz0',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'ObjectExpression',
            properties: [
              {
                ...DEFAULT_NODE,
                type: 'ObjectProperty',
                key: {
                  ...DEFAULT_NODE,
                  type: 'Identifier',
                  name: 'baz1',
                },
                value: {
                  ...DEFAULT_NODE,
                  type: 'StringLiteral',
                  value: 'abc',
                },
                computed: false,
                shorthand: false,
              },
            ],
          },
          computed: false,
          shorthand: false,
        },
      ],
    };

    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [
        {
          type: 'TableNameKeyField',
          key: {
            type: 'Identifier',
            name: 'foo0',
          },
          value: {
            type: 'TableConstructor',
            elements: [
              {
                type: 'TableNameKeyField',
                key: {
                  type: 'Identifier',
                  name: 'foo1',
                },
                value: {
                  type: 'BooleanLiteral',
                  value: true,
                },
              },
            ],
          },
        },
        {
          type: 'TableNameKeyField',
          key: {
            type: 'Identifier',
            name: 'bar0',
          },
          value: {
            type: 'TableConstructor',
            elements: [
              {
                type: 'TableNameKeyField',
                key: {
                  type: 'Identifier',
                  name: 'bar1',
                },
                value: {
                  type: 'NumericLiteral',
                  value: 1,
                },
              },
            ],
          },
        },
        {
          type: 'TableNameKeyField',
          key: {
            type: 'Identifier',
            name: 'baz0',
          },
          value: {
            type: 'TableConstructor',
            elements: [
              {
                type: 'TableNameKeyField',
                key: {
                  type: 'Identifier',
                  name: 'baz1',
                },
                value: {
                  type: 'StringLiteral',
                  value: 'abc',
                },
              },
            ],
          },
        },
      ],
    };

    expect(handleObjectExpression.handler(given)).toEqual(expected);
  });

  it(`should handle deeply nested objects`, () => {
    const given: ObjectExpression = {
      ...DEFAULT_NODE,
      type: 'ObjectExpression',
      properties: [
        {
          ...DEFAULT_NODE,
          type: 'ObjectProperty',
          key: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'foo',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'ObjectExpression',
            properties: [
              {
                ...DEFAULT_NODE,
                type: 'ObjectProperty',
                key: {
                  ...DEFAULT_NODE,
                  type: 'Identifier',
                  name: 'bar',
                },
                value: {
                  ...DEFAULT_NODE,
                  type: 'ObjectExpression',
                  properties: [
                    {
                      ...DEFAULT_NODE,
                      type: 'ObjectProperty',
                      key: {
                        ...DEFAULT_NODE,
                        type: 'Identifier',
                        name: 'baz',
                      },
                      value: {
                        ...DEFAULT_NODE,
                        type: 'ObjectExpression',
                        properties: [],
                      },
                      computed: false,
                      shorthand: false,
                    },
                  ],
                },
                computed: false,
                shorthand: false,
              },
            ],
          },
          computed: false,
          shorthand: false,
        },
      ],
    };

    const expected: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [
        {
          type: 'TableNameKeyField',
          key: {
            type: 'Identifier',
            name: 'foo',
          },
          value: {
            type: 'TableConstructor',
            elements: [
              {
                type: 'TableNameKeyField',
                key: {
                  type: 'Identifier',
                  name: 'bar',
                },
                value: {
                  type: 'TableConstructor',
                  elements: [
                    {
                      type: 'TableNameKeyField',
                      key: {
                        type: 'Identifier',
                        name: 'baz',
                      },
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

    expect(handleObjectExpression.handler(given)).toEqual(expected);
  });
});
