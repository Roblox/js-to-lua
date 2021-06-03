import { MemberExpression } from '@babel/types';
import {
  identifier,
  indexExpression,
  LuaIndexExpression,
  callExpression,
  numericLiteral,
  stringLiteral,
  booleanLiteral,
  memberExpression,
  LuaMemberExpression,
} from '@js-to-lua/lua-types';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import { handleExpression } from './expression-statement.handler';
import { createMemberExpressionHandler } from './member-expression.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Member Expression Handler', () => {
  it(`should convert handle computed index expression: string literal`, () => {
    const given: MemberExpression = {
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
    };

    const handleMemberExpression = createMemberExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      stringLiteral('bar')
    );

    expect(handleMemberExpression.handler(given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: number literal`, () => {
    const given: MemberExpression = {
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
        type: 'NumericLiteral',
        value: 5,
      },
    };

    const handleMemberExpression = createMemberExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      numericLiteral(6)
    );

    expect(handleMemberExpression.handler(given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: octal number literal`, () => {
    const given: MemberExpression = {
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
        type: 'NumericLiteral',
        value: 12,
        extra: {
          raw: '0o14',
        },
      },
    };

    const handleMemberExpression = createMemberExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      numericLiteral(13)
    );

    expect(handleMemberExpression.handler(given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: boolean literal`, () => {
    const given: MemberExpression = {
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
        type: 'BooleanLiteral',
        value: true,
      },
    };

    const handleMemberExpression = createMemberExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      callExpression(identifier('tostring'), [booleanLiteral(true)])
    );

    expect(handleMemberExpression.handler(given)).toEqual(expected);
  });

  it(`should convert handle not computed member expression`, () => {
    const given: MemberExpression = {
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
    };

    const handleMemberExpression = createMemberExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaMemberExpression = memberExpression(
      identifier('foo'),
      '.',
      identifier('bar')
    );

    expect(handleMemberExpression.handler(given)).toEqual(expected);
  });
});