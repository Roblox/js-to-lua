import { handleProgram } from '@js-to-lua/js-to-lua';
import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Block Statement', () => {
    it('should handle empty block statement', () => {
      const given = getProgramNode(`
      {

      }
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle simple block statements', () => {
    const given = getProgramNode(`
    {
      const name = "wole";
      let arr = [1,2, true];
    }
  `);

    const expected: LuaProgram = {
      type: 'Program',
      body: [
        {
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
              type: 'VariableDeclaration',
              identifiers: [
                {
                  type: 'VariableDeclaratorIdentifier',
                  value: {
                    type: 'Identifier',
                    name: 'arr',
                  },
                },
              ],
              values: [
                {
                  type: 'VariableDeclaratorValue',
                  value: {
                    type: 'TableConstructor',
                    elements: [
                      {
                        type: 'TableNoKeyField',
                        value: {
                          type: 'NumericLiteral',
                          value: 1,
                          extra: {
                            raw: '1',
                          },
                        },
                      },
                      {
                        type: 'TableNoKeyField',
                        value: {
                          type: 'NumericLiteral',
                          value: 2,
                          extra: {
                            raw: '2',
                          },
                        },
                      },
                      {
                        type: 'TableNoKeyField',
                        value: {
                          type: 'BooleanLiteral',
                          value: true,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle nested blocks', () => {
    const given = getProgramNode(`
    {
      const name = "wole";
      {
        "roblox"
        1
      }
    }
  `);
    const expected: LuaProgram = {
      type: 'Program',
      body: [
        {
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
        },
      ],
    };

    const luaProgram = handleProgram.handler(given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle deeply nested blocks', () => {
    const given = getProgramNode(`
    {
      const name = "wole";
      {
        "roblox"
        1
        {
          "roblox"
        }
      }
    }
  `);
    const expected: LuaProgram = {
      type: 'Program',
      body: [
        {
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
        },
      ],
    };

    const luaProgram = handleProgram.handler(given);

    expect(luaProgram).toEqual(expected);
  });
});
