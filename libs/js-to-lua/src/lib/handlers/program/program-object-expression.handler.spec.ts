import { getProgramNode } from './program.spec.utils';
import { LuaProgram } from '../../lua-nodes.types';
import { handleProgram } from './program.handler';

describe('Program handler', () => {
  describe('Object expression', () => {
    it('should return empty Lua Table Constructor', () => {
      const given = getProgramNode(`
        ({})
      `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TableConstructor',
              elements: [],
            },
          },
        ],
      };

      expect(handleProgram.handler(given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with TableNameKeyField elements`, () => {
      const given = getProgramNode(`
        ({
          foo: true,
          bar: 1,
          baz: 'abc'
        })
      `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                    extra: {
                      raw: '1',
                    },
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
            },
          },
        ],
      };

      expect(handleProgram.handler(given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with TableNameKeyField elements when shorthand JS notation is used`, () => {
      const given = getProgramNode(`
        ({
          foo,
          bar,
          baz,
        })
      `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TableConstructor',
              elements: [
                {
                  type: 'TableNameKeyField',
                  key: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                  value: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
                {
                  type: 'TableNameKeyField',
                  key: {
                    type: 'Identifier',
                    name: 'bar',
                  },
                  value: {
                    type: 'Identifier',
                    name: 'bar',
                  },
                },
                {
                  type: 'TableNameKeyField',
                  key: {
                    type: 'Identifier',
                    name: 'baz',
                  },
                  value: {
                    type: 'Identifier',
                    name: 'baz',
                  },
                },
              ],
            },
          },
        ],
      };

      expect(handleProgram.handler(given)).toEqual(expected);
    });

    it(`should return Lua Table Constructor Node with TableExpressionKeyField elements`, () => {
      const given = getProgramNode(`
        ({
          "foo": true,
          'bar': 1,
          ['baz']: 'abc'
        })
      `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                    extra: {
                      raw: '1',
                    },
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
            },
          },
        ],
      };

      expect(handleProgram.handler(given)).toEqual(expected);
    });

    it(`should handle object of objects`, () => {
      const given = getProgramNode(`
        ({
          foo0: {
            foo1: true
          },
          bar0: {
            bar1: 1
          },
          baz0: {
            baz1: 'abc'
          },
        })
      `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                          extra: {
                            raw: '1',
                          },
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
            },
          },
        ],
      };

      expect(handleProgram.handler(given)).toEqual(expected);
    });

    it(`should handle deeply nested objects`, () => {
      const given = getProgramNode(`
        ({
          foo: {
            bar: {
              baz: {}
            }
          }
        })
      `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
            },
          },
        ],
      };

      expect(handleProgram.handler(given)).toEqual(expected);
    });
  });
});
