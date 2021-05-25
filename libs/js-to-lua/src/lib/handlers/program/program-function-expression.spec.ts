import { handleProgram } from './program.handler';
import { LuaProgram } from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Function Expressions', () => {
    it('should ignore function name', () => {
      const given = getProgramNode(`
       const foo = function foo() {}
      `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            identifiers: [
              {
                type: 'VariableDeclaratorIdentifier',
                value: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            ],
            values: [
              {
                type: 'VariableDeclaratorValue',
                value: {
                  type: 'FunctionExpression',
                  body: [],
                  params: [],
                  defaultValues: [],
                },
              },
            ],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with no params', () => {
      const given = getProgramNode(`
     const foo = function () {}
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            identifiers: [
              {
                type: 'VariableDeclaratorIdentifier',
                value: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            ],
            values: [
              {
                type: 'VariableDeclaratorValue',
                value: {
                  type: 'FunctionExpression',
                  body: [],
                  params: [],
                  defaultValues: [],
                },
              },
            ],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params', () => {
      const given = getProgramNode(`
   const foo = function (bar, baz) {}
  `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            identifiers: [
              {
                type: 'VariableDeclaratorIdentifier',
                value: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            ],
            values: [
              {
                type: 'VariableDeclaratorValue',
                value: {
                  type: 'FunctionExpression',
                  body: [],
                  params: [
                    {
                      type: 'Identifier',
                      name: 'bar',
                    },
                    {
                      type: 'Identifier',
                      name: 'baz',
                    },
                  ],
                  defaultValues: [],
                },
              },
            ],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params and default values', () => {
      const given = getProgramNode(`
   const foo = function (bar, baz = 'hello') {}
  `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            identifiers: [
              {
                type: 'VariableDeclaratorIdentifier',
                value: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            ],
            values: [
              {
                type: 'VariableDeclaratorValue',
                value: {
                  type: 'FunctionExpression',
                  body: [],
                  params: [
                    {
                      type: 'Identifier',
                      name: 'bar',
                    },
                    {
                      type: 'Identifier',
                      name: 'baz',
                    },
                  ],
                  defaultValues: [],
                },
              },
            ],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram.body[0]['values'][0].value.defaultValues.length).toBe(
        1
      ); //TODO: remove when AssignmentPattern is available
      luaProgram.body[0]['values'][0].value.defaultValues = []; //TODO: remove when AssigmentBlock is available
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with function body', () => {
      const given = getProgramNode(`
   const foo = function (bar, baz = 'hello') {
       let fizz = 'fuzz';
   }
  `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            identifiers: [
              {
                type: 'VariableDeclaratorIdentifier',
                value: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            ],
            values: [
              {
                type: 'VariableDeclaratorValue',
                value: {
                  type: 'FunctionExpression',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      identifiers: [
                        {
                          type: 'VariableDeclaratorIdentifier',
                          value: {
                            type: 'Identifier',
                            name: 'fizz',
                          },
                        },
                      ],
                      values: [
                        {
                          type: 'VariableDeclaratorValue',
                          value: {
                            type: 'StringLiteral',
                            value: 'fuzz',
                          },
                        },
                      ],
                    },
                  ],
                  params: [
                    {
                      type: 'Identifier',
                      name: 'bar',
                    },
                    {
                      type: 'Identifier',
                      name: 'baz',
                    },
                  ],
                  defaultValues: [],
                },
              },
            ],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram.body[0]['values'][0].value.defaultValues.length).toBe(
        1
      ); //TODO: remove when AssignmentPattern is available
      luaProgram.body[0]['values'][0].value.defaultValues = []; //TODO: remove when AssigmentBlock is available
      expect(luaProgram).toEqual(expected);
    });
  });
});
