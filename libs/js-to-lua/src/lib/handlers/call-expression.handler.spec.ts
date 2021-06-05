import { CallExpression } from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  numericLiteral,
  stringLiteral,
  memberExpression,
  indexExpression,
} from '@js-to-lua/lua-types';
import {
  handleCallExpression,
  USE_DOT_NOTATION_IN_CALL_EXPRESSION,
} from './expression-statement.handler';
const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Call Expression Handler', () => {
  it(`should return Call with no parameters`, () => {
    const given: CallExpression = {
      ...DEFAULT_NODE,
      type: 'CallExpression',
      callee: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'Symbol',
      },
      arguments: [],
    };

    const expected: LuaCallExpression = callExpression(
      identifier('Symbol'),
      []
    );

    expect(handleCallExpression.handler(given)).toEqual(expected);
  });

  it(`should return Call with parameters`, () => {
    const given: CallExpression = {
      ...DEFAULT_NODE,
      type: 'CallExpression',
      callee: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'test',
      },
      arguments: [
        {
          ...DEFAULT_NODE,
          type: 'NumericLiteral',
          extra: {
            ...DEFAULT_NODE,
            rawValue: 5,
            raw: '5',
          },
          value: 5,
        },
        {
          ...DEFAULT_NODE,
          type: 'StringLiteral',
          value: 'wole',
        },
      ],
    };

    const expected: LuaCallExpression = callExpression(identifier('test'), [
      numericLiteral(5, '5'),
      stringLiteral('wole'),
    ]);

    expect(handleCallExpression.handler(given)).toEqual(expected);
  });

  it(`should handle computed member expressions`, () => {
    const given: CallExpression = {
      ...DEFAULT_NODE,
      type: 'CallExpression',
      callee: {
        ...DEFAULT_NODE,
        type: 'MemberExpression',
        computed: true,
        object: {
          ...DEFAULT_NODE,
          type: 'Identifier',
          name: 'foo',
        },
        property: {
          ...DEFAULT_NODE,
          type: 'StringLiteral',
          value: 'bar',
        },
      },
      arguments: [
        {
          ...DEFAULT_NODE,
          type: 'StringLiteral',
          value: 'baz',
        },
      ],
    };

    const expected: LuaCallExpression = callExpression(
      indexExpression(identifier('foo'), stringLiteral('bar')),
      [identifier('foo'), stringLiteral('baz')]
    );

    expect(handleCallExpression.handler(given)).toEqual(expected);
  });

  it(`should handle not computed member expressions`, () => {
    const given: CallExpression = {
      ...DEFAULT_NODE,
      type: 'CallExpression',
      callee: {
        ...DEFAULT_NODE,
        type: 'MemberExpression',
        computed: false,
        object: {
          ...DEFAULT_NODE,
          type: 'Identifier',
          name: 'foo',
        },
        property: {
          ...DEFAULT_NODE,
          type: 'Identifier',
          name: 'bar',
        },
      },
      arguments: [
        {
          ...DEFAULT_NODE,
          type: 'StringLiteral',
          value: 'baz',
        },
      ],
    };

    const expected: LuaCallExpression = callExpression(
      memberExpression(identifier('foo'), ':', identifier('bar')),
      [stringLiteral('baz')]
    );

    expect(handleCallExpression.handler(given)).toEqual(expected);
  });

  describe('Special cases', () => {
    it(`should handle not computed toString() method`, () => {
      const given: CallExpression = {
        ...DEFAULT_NODE,
        type: 'CallExpression',
        callee: {
          ...DEFAULT_NODE,
          type: 'MemberExpression',
          computed: false,
          object: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'foo',
          },
          property: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'toString',
          },
        },
        arguments: [],
      };

      const expected: LuaCallExpression = callExpression(
        identifier('tostring'),
        [identifier('foo')]
      );

      expect(handleCallExpression.handler(given)).toEqual(expected);
    });

    it(`should handle computed toString() method`, () => {
      const given: CallExpression = {
        ...DEFAULT_NODE,
        type: 'CallExpression',
        callee: {
          ...DEFAULT_NODE,
          type: 'MemberExpression',
          computed: true,
          object: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'foo',
          },
          property: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'toString',
          },
        },
        arguments: [],
      };

      const expected: LuaCallExpression = callExpression(
        identifier('tostring'),
        [identifier('foo')]
      );

      expect(handleCallExpression.handler(given)).toEqual(expected);
    });

    it(`should handle treat toString() method as a regular method when it has arguments`, () => {
      const given: CallExpression = {
        ...DEFAULT_NODE,
        type: 'CallExpression',
        callee: {
          ...DEFAULT_NODE,
          type: 'MemberExpression',
          computed: true,
          object: {
            ...DEFAULT_NODE,
            type: 'Identifier',
            name: 'foo',
          },
          property: {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'toString',
          },
        },
        arguments: [
          {
            ...DEFAULT_NODE,
            type: 'StringLiteral',
            value: 'bar',
          },
        ],
      };

      const expected: LuaCallExpression = callExpression(
        indexExpression(identifier('foo'), stringLiteral('toString')),
        [identifier('foo'), stringLiteral('bar')]
      );

      expect(handleCallExpression.handler(given)).toEqual(expected);
    });

    USE_DOT_NOTATION_IN_CALL_EXPRESSION.forEach((id) => {
      it(`should handle not computed ${id} object`, () => {
        const given: CallExpression = {
          ...DEFAULT_NODE,
          type: 'CallExpression',
          callee: {
            ...DEFAULT_NODE,
            type: 'MemberExpression',
            computed: false,
            object: {
              ...DEFAULT_NODE,
              type: 'Identifier',
              name: id,
            },
            property: {
              ...DEFAULT_NODE,
              type: 'Identifier',
              name: 'foo',
            },
          },
          arguments: [],
        };

        const expected: LuaCallExpression = callExpression(
          memberExpression(identifier(id), '.', identifier('foo')),
          []
        );
        expect(handleCallExpression.handler(given)).toEqual(expected);
      });

      it(`should handle computed ${id} object`, () => {
        const given: CallExpression = {
          ...DEFAULT_NODE,
          type: 'CallExpression',
          callee: {
            ...DEFAULT_NODE,
            type: 'MemberExpression',
            computed: true,
            object: {
              ...DEFAULT_NODE,
              type: 'Identifier',
              name: id,
            },
            property: {
              ...DEFAULT_NODE,
              type: 'StringLiteral',
              value: 'foo',
            },
          },
          arguments: [],
        };

        const expected: LuaCallExpression = callExpression(
          indexExpression(identifier(id), stringLiteral('foo')),
          []
        );
        expect(handleCallExpression.handler(given)).toEqual(expected);
      });
    });
  });
});
