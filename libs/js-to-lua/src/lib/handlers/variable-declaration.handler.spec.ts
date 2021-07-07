import { VariableDeclaration } from '@babel/types';
import { LuaVariableDeclaration } from '@js-to-lua/lua-types';
import { handleVariableDeclaration } from './expression-statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

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
        values: [],
      };

      expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  ['foo', 'bar', 'baz'].forEach((name) => {
    it(`should return LuaVariableDeclaration Node with declarations and initialization`, () => {
      const given: VariableDeclaration = {
        ...DEFAULT_NODE,
        type: 'VariableDeclaration',
        kind: 'let',
        declarations: [
          {
            ...DEFAULT_NODE,
            type: 'VariableDeclarator',
            id: { ...DEFAULT_NODE, type: 'Identifier', name },
            init: {
              ...DEFAULT_NODE,
              type: 'StringLiteral',
              value: 'abc',
            },
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
        values: [
          {
            type: 'VariableDeclaratorValue',
            value: {
              type: 'StringLiteral',
              value: 'abc',
            },
          },
        ],
      };

      expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null in the middle`, () => {
    const given: VariableDeclaration = {
      ...DEFAULT_NODE,
      type: 'VariableDeclaration',
      kind: 'let',
      declarations: [
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclarator',
          id: { ...DEFAULT_NODE, type: 'Identifier', name: 'foo' },
          init: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'foo',
          },
        },
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclarator',
          id: { ...DEFAULT_NODE, type: 'Identifier', name: 'bar' },
        },
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclarator',
          id: { ...DEFAULT_NODE, type: 'Identifier', name: 'baz' },
          init: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'baz',
          },
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
        {
          type: 'VariableDeclaratorIdentifier',
          value: {
            type: 'Identifier',
            name: 'baz',
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
          value: null,
        },
        {
          type: 'VariableDeclaratorValue',
          value: {
            type: 'StringLiteral',
            value: 'baz',
          },
        },
      ],
    };

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null at the end`, () => {
    const given: VariableDeclaration = {
      ...DEFAULT_NODE,
      type: 'VariableDeclaration',
      kind: 'let',
      declarations: [
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclarator',
          id: { ...DEFAULT_NODE, type: 'Identifier', name: 'foo' },
          init: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'foo',
          },
        },
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclarator',
          id: { ...DEFAULT_NODE, type: 'Identifier', name: 'bar' },
          init: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'bar',
          },
        },
        {
          ...DEFAULT_NODE,
          type: 'VariableDeclarator',
          id: { ...DEFAULT_NODE, type: 'Identifier', name: 'baz' },
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
        {
          type: 'VariableDeclaratorIdentifier',
          value: {
            type: 'Identifier',
            name: 'baz',
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
    };

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
