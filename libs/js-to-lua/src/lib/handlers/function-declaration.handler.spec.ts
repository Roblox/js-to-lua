import { FunctionDeclaration } from '@babel/types';
import { LuaFunctionDeclaration } from '../lua-nodes.types';
import { handleStatement } from './expression-statement.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Function Declaration', () => {
  it(`should return LuaFunctionDeclaration Node`, () => {
    const given: FunctionDeclaration = {
      ...DEFAULT_NODE,
      type: 'FunctionDeclaration',

      id: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      generator: false,
      async: false,
      params: [
        {
          ...DEFAULT_NODE,
          type: 'Identifier',
          name: 'bar',
        },
        {
          ...DEFAULT_NODE,
          type: 'Identifier',
          name: 'baz',
        },
      ],
      body: {
        ...DEFAULT_NODE,
        type: 'BlockStatement',
        body: [],
        directives: [],
      },
    };
    const expected: LuaFunctionDeclaration = {
      type: 'FunctionDeclaration',
      body: [],
      id: {
        type: 'Identifier',
        name: 'foo',
      },
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
    };

    expect(handleStatement.handler(given)).toEqual(expected);
  });
});
