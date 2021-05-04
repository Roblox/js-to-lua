import { VariableDeclaration } from '@babel/types';
import { LuaVariableDeclaration } from '../lua-nodes.types';
import { handleVariableDeclaration } from './variable-declaration.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Variable Declaration', () => {
  ['foo', 'bar', 'baz'].forEach((name) => {
    it(`should return LuaVariableDeclaration Node with declarations`, () => {
      const given: VariableDeclaration = {
        ...DEFAULT_NODE,
        type: 'VariableDeclaration',
        kind: 'let',
        declarations: [
          {
            ...DEFAULT_NODE,
            type: 'VariableDeclarator',
            id: { ...DEFAULT_NODE, type: 'Identifier', name },
          },
        ],
      };
      const expected: LuaVariableDeclaration = {
        type: 'VariableDeclaration',
        identifiers: [
          {
            type: 'VariableDeclaratorIdentifier',
            value: {
              type: 'Identifier',
              name,
            },
          },
        ],
        values: [{ type: 'VariableDeclaratorValue', value: null }],
      };

      expect(handleVariableDeclaration.handler(given)).toEqual(expected);
    });
  });
});
