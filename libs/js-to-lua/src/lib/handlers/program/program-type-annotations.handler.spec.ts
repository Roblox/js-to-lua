import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

describe('Program handler', () => {
  describe('TS: TypeAnnotations', () => {
    it('should handle "any"', () => {
      const given = getProgramNode(`
     let foo: any;
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
                  typeAnnotation: {
                    type: 'LuaTypeAnnotation',
                    typeAnnotation: {
                      type: 'LuaTypeAny',
                    },
                  },
                },
              },
            ],
            values: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle "string"', () => {
      const given = getProgramNode(`
     let foo: string;
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
                  typeAnnotation: {
                    type: 'LuaTypeAnnotation',
                    typeAnnotation: {
                      type: 'LuaTypeString',
                    },
                  },
                },
              },
            ],
            values: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle "number"', () => {
      const given = getProgramNode(`
     let foo: number;
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
                  typeAnnotation: {
                    type: 'LuaTypeAnnotation',
                    typeAnnotation: {
                      type: 'LuaTypeNumber',
                    },
                  },
                },
              },
            ],
            values: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle "boolean"', () => {
      const given = getProgramNode(`
     let foo: boolean;
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
                  typeAnnotation: {
                    type: 'LuaTypeAnnotation',
                    typeAnnotation: {
                      type: 'LuaTypeBoolean',
                    },
                  },
                },
              },
            ],
            values: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle type literal', () => {
      const given = getProgramNode(`
     let foo: {
       bar: number,
       baz: string,
       fizz: boolean,
       fuzz: any
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
                  typeAnnotation: {
                    type: 'LuaTypeAnnotation',
                    typeAnnotation: {
                      type: 'LuaTypeLiteral',
                      members: [
                        {
                          key: {
                            name: 'bar',
                            type: 'Identifier',
                          },
                          type: 'LuaPropertySignature',
                          typeAnnotation: {
                            type: 'LuaTypeAnnotation',
                            typeAnnotation: {
                              type: 'LuaTypeNumber',
                            },
                          },
                        },
                        {
                          key: {
                            name: 'baz',
                            type: 'Identifier',
                          },
                          type: 'LuaPropertySignature',
                          typeAnnotation: {
                            type: 'LuaTypeAnnotation',
                            typeAnnotation: {
                              type: 'LuaTypeString',
                            },
                          },
                        },
                        {
                          key: {
                            name: 'fizz',
                            type: 'Identifier',
                          },
                          type: 'LuaPropertySignature',
                          typeAnnotation: {
                            type: 'LuaTypeAnnotation',
                            typeAnnotation: {
                              type: 'LuaTypeBoolean',
                            },
                          },
                        },
                        {
                          key: {
                            name: 'fuzz',
                            type: 'Identifier',
                          },
                          type: 'LuaPropertySignature',
                          typeAnnotation: {
                            type: 'LuaTypeAnnotation',
                            typeAnnotation: {
                              type: 'LuaTypeAny',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
            values: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should default unhandled types to "any"', () => {
      const given = getProgramNode(`
       let foo: UnhandledType;
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
                  typeAnnotation: {
                    type: 'LuaTypeAnnotation',
                    typeAnnotation: {
                      type: 'LuaTypeAny',
                    },
                  },
                },
              },
            ],
            values: [],
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
