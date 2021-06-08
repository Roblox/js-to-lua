import {
  functionDeclaration,
  identifier,
  LuaProgram,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Function Declarations', () => {
    it('should handle function with no params', () => {
      const given = getProgramNode(`
     function foo() {}
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'foo',
            },
            body: [],
            params: [],
            defaultValues: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(source, given);
      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle function with params', () => {
    const given = getProgramNode(`
   function foo(bar, baz) {}
  `);
    const expected: LuaProgram = {
      type: 'Program',
      body: [
        {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'foo',
          },
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
      ],
    };

    const luaProgram = handleProgram.handler(source, given);
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with params and default values', () => {
    const given = getProgramNode(`
   function foo(bar, baz = 'hello') {}
  `);
    const expected: LuaProgram = {
      type: 'Program',
      body: [
        {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'foo',
          },
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
      ],
    };

    const luaProgram = handleProgram.handler(source, given);
    expect(luaProgram.body[0]['defaultValues'].length).toBe(1); //TODO: remove when AssignmentPattern is available
    luaProgram.body[0]['defaultValues'] = []; //TODO: remove when AssigmentBlock is available
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with function body', () => {
    const given = getProgramNode(`
   function foo(bar, baz = 'hello') {
       let fizz = 'fuzz';
   }
  `);

    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [identifier('bar'), identifier('baz')],
        [],
        [
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('fizz'))],
            [variableDeclaratorValue(stringLiteral('fuzz'))]
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, given);
    expect(luaProgram.body[0]['defaultValues'].length).toBe(1); //TODO: remove when AssignmentPattern is available
    luaProgram.body[0]['defaultValues'] = []; //TODO: remove when AssigmentBlock is available
    expect(luaProgram).toEqual(expected);
  });
});
