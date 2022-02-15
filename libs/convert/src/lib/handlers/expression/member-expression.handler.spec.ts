import { MemberExpression } from '@babel/types';
import { forwardHandlerRef } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  booleanLiteral,
  callExpression,
  identifier,
  indexExpression,
  LuaIndexExpression,
  LuaMemberExpression,
  memberExpression,
  numericLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { handleExpression } from '../expression-statement.handler';
import { createMemberExpressionHandler } from './member-expression.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const handleMemberExpression = createMemberExpressionHandler(
  forwardHandlerRef(() => handleExpression)
);

const source = '';

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

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      stringLiteral('bar')
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      withTrailingConversionComment(
        numericLiteral(6),
        'ROBLOX adaptation: added 1 to array index'
      )
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      withTrailingConversionComment(
        numericLiteral(13),
        'ROBLOX adaptation: added 1 to array index'
      )
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      callExpression(identifier('tostring'), [booleanLiteral(true)])
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: expression`, () => {
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
        type: 'Identifier',
        name: 'bar',
      },
    };

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      callExpression(identifier('tostring'), [identifier('bar')])
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: binary expression, adding string literal`, () => {
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
        type: 'BinaryExpression',
        operator: '+',
        left: {
          ...DEFAULT_NODE,
          type: 'StringLiteral',
          value: 'bar',
        },
        right: {
          ...DEFAULT_NODE,
          type: 'Identifier',
          name: 'baz',
        },
      },
    };

    const expected: LuaIndexExpression = indexExpression(
      identifier('foo'),
      binaryExpression(
        stringLiteral('bar'),
        '..',
        callExpression(identifier('tostring'), [identifier('baz')])
      )
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
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

    const expected: LuaMemberExpression = memberExpression(
      identifier('foo'),
      '.',
      identifier('bar')
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });
});
