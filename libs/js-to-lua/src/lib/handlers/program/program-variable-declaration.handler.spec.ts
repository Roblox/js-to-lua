import { LuaProgram } from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Variable Declarations', () => {
    it('should handle let: not initialized', () => {
      const given = getProgramNode(`
     let foo;
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
            values: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(source, given);

      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle let: initialized', () => {
    const given = getProgramNode(`
   let foo = 'foo';
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
                type: 'StringLiteral',
                value: 'foo',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle let: multiple', () => {
    const given = getProgramNode(`
    let foo, bar = 'bar';
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
            {
              type: 'VariableDeclaratorIdentifier',
              value: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          ],
          values: [
            {
              type: 'VariableDeclaratorValue',
              value: null,
            },
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'bar',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle let: multiple - partially initialized', () => {
    const given = getProgramNode(`
    let foo = 'foo', bar;
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
            {
              type: 'VariableDeclaratorIdentifier',
              value: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          ],
          values: [
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'foo',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle const', () => {
    const given = getProgramNode(`
   const foo = 'foo';
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
                type: 'StringLiteral',
                value: 'foo',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle const: multiple', () => {
    const given = getProgramNode(`
    const foo = 'foo', bar = 'bar';

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
            {
              type: 'VariableDeclaratorIdentifier',
              value: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          ],
          values: [
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'foo',
              },
            },
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'bar',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: not initialized', () => {
    const given = getProgramNode(`
    var foo;
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
          values: [],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: initialized', () => {
    const given = getProgramNode(`
   var foo = 'foo';
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
                type: 'StringLiteral',
                value: 'foo',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: multiple', () => {
    const given = getProgramNode(`
   var foo, bar = 'bar';
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
            {
              type: 'VariableDeclaratorIdentifier',
              value: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          ],
          values: [
            {
              type: 'VariableDeclaratorValue',
              value: null,
            },
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'bar',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: multiple - partially initialized', () => {
    const given = getProgramNode(`
   var foo = 'foo', bar;
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
            {
              type: 'VariableDeclaratorIdentifier',
              value: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          ],
          values: [
            {
              type: 'VariableDeclaratorValue',
              value: {
                type: 'StringLiteral',
                value: 'foo',
              },
            },
          ],
        },
      ],
    };

    const luaProgram = handleProgram.handler(source, given);

    expect(luaProgram).toEqual(expected);
  });
});
