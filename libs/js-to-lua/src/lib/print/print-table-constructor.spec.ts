import { LuaTableConstructor } from '../lua-nodes.types';
import { printTableConstructor } from './print-node';

describe('Print Table Constructor', () => {
  it(`should print Lua Table Constructor Node with empty elements`, () => {
    const given: LuaTableConstructor = {
      type: 'TableConstructor',
      elements: [],
    };
    const expected = '{}';

    expect(printTableConstructor(given, '')).toEqual(expected);
  });

  it(`should print Lua Table Constructor Node with TableNoKeyField elements`, () => {
    const given: LuaTableConstructor = {
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
        {
          type: 'TableNoKeyField',
          value: {
            type: 'Identifier',
            name: 'foo',
          },
        },
      ],
    };
    const expected = '{true, 1, "abc", foo}';

    expect(printTableConstructor(given, '')).toEqual(expected);
  });

  it(`should print Lua Table Constructor Node with TableNameKeyField elements`, () => {
    const given: LuaTableConstructor = {
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
    const expected = '{foo = true, bar = 1, baz = "abc"}';

    expect(printTableConstructor(given, '')).toEqual(expected);
  });

  it(`should print Lua Table Constructor Node with TableExpressionKeyField elements`, () => {
    const given: LuaTableConstructor = {
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
    const expected = '{["foo"] = true, ["bar"] = 1, ["baz"] = "abc"}';

    expect(printTableConstructor(given, '')).toEqual(expected);
  });

  it(`should print Lua Table Constructor of Lua Table Constructors`, () => {
    const given: LuaTableConstructor = {
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
    const expected =
      '{foo0 = {foo1 = true}, bar0 = {bar1 = 1}, baz0 = {baz1 = "abc"}}';

    expect(printTableConstructor(given, '')).toEqual(expected);
  });

  it(`should print deeply nested Lua Table Constructor`, () => {
    const given: LuaTableConstructor = {
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
    const expected = '{foo = {bar = {baz = {}}}}';

    expect(printTableConstructor(given, '')).toEqual(expected);
  });
});
