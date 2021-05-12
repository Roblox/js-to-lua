import { handleProgram } from '@js-to-lua/js-to-lua';
import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';

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
