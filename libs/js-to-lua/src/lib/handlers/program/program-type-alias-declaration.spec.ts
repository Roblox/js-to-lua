import { handleProgram } from '@js-to-lua/js-to-lua';
import { LuaProgram } from '../../lua-nodes.types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('TS: Type Alias Declaration', () => {
    it('should handle simple type declaration', () => {
      const given = getProgramNode(`
     type foo = any;
    `);
      const expected: LuaProgram = {
        type: 'Program',
        body: [
          {
            type: 'LuaTypeAliasDeclaration',
            id: {
              type: 'Identifier',
              name: 'foo',
            },
            typeAnnotation: {
              type: 'LuaTypeAny',
            },
          },
        ],
      };

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
