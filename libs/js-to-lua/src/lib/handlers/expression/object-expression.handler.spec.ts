import { ObjectExpression } from '@babel/types';
import {
  LuaTableConstructor,
  tableConstructor,
  tableNameKeyField,
  identifier,
  booleanLiteral,
  numericLiteral,
  stringLiteral,
  functionExpression,
  tableExpressionKeyField,
} from '@js-to-lua/lua-types';
import { handleObjectExpression } from '../expression-statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

describe('Object Expression Handler', () => {
  it(`should return Lua Table Constructor Node with empty elements`, () => {
    const given: ObjectExpression = {
      ...DEFAULT_NODE,
      type: 'ObjectExpression',
      properties: [],
    };

    const expected: LuaTableConstructor = tableConstructor([]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaTableConstructor = tableConstructor([
      tableNameKeyField(identifier('foo'), booleanLiteral(true)),
      tableNameKeyField(identifier('bar'), numericLiteral(1)),
      tableNameKeyField(identifier('baz'), stringLiteral('abc')),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaTableConstructor = tableConstructor([
      tableExpressionKeyField(stringLiteral('foo'), booleanLiteral(true)),
      tableExpressionKeyField(stringLiteral('bar'), numericLiteral(1)),
      tableExpressionKeyField(stringLiteral('baz'), stringLiteral('abc')),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaTableConstructor = tableConstructor([
      tableNameKeyField(
        identifier('foo0'),
        tableConstructor([
          tableNameKeyField(identifier('foo1'), booleanLiteral(true)),
        ])
      ),
      tableNameKeyField(
        identifier('bar0'),
        tableConstructor([
          tableNameKeyField(identifier('bar1'), numericLiteral(1)),
        ])
      ),
      tableNameKeyField(
        identifier('baz0'),
        tableConstructor([
          tableNameKeyField(identifier('baz1'), stringLiteral('abc')),
        ])
      ),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle object with methods`, () => {
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
            name: 'sound',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'bla',
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
            name: 'method1',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'FunctionExpression',
            params: [],
            body: {
              ...DEFAULT_NODE,
              type: 'BlockStatement',
              body: [],
              directives: [],
            },
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
            name: 'method2',
          },
          value: {
            ...DEFAULT_NODE,
            type: 'FunctionExpression',
            params: [
              {
                ...DEFAULT_NODE,
                type: 'Identifier',
                name: 'name',
              },
            ],
            body: {
              ...DEFAULT_NODE,
              type: 'BlockStatement',
              body: [],
              directives: [],
            },
          },
          computed: false,
          shorthand: false,
        },
      ],
    };

    const expected: LuaTableConstructor = tableConstructor([
      tableNameKeyField(identifier('sound'), stringLiteral('bla')),
      tableNameKeyField(
        identifier('method1'),
        functionExpression([identifier('self')])
      ),
      tableNameKeyField(
        identifier('method2'),
        functionExpression([identifier('self'), identifier('name')])
      ),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaTableConstructor = tableConstructor([
      tableNameKeyField(
        identifier('foo'),
        tableConstructor([
          tableNameKeyField(
            identifier('bar'),
            tableConstructor([
              tableNameKeyField(identifier('baz'), tableConstructor([])),
            ])
          ),
        ])
      ),
    ]);

    expect(handleObjectExpression.handler(source, {}, given)).toEqual(expected);
  });
});
