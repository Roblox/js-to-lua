import {
  binaryExpression as babelBinaryExpression,
  booleanLiteral as babelBooleanLiteral,
  identifier as babelIdentifier,
  memberExpression as babelMemberExpression,
  numericLiteral as babelNumericLiteral,
  privateName,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import { forwardHandlerRef } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  booleanLiteral,
  callExpression,
  identifier,
  indexExpression,
  memberExpression,
  numericLiteral,
  stringLiteral,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { handleExpression } from '../expression-statement.handler';
import { createMemberExpressionHandler } from './member-expression.handler';

const handleMemberExpression = createMemberExpressionHandler(
  forwardHandlerRef(() => handleExpression)
);

const source = '';

describe('Member Expression Handler', () => {
  it(`should convert handle computed index expression: string literal`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      babelStringLiteral('bar'),
      true
    );

    const expected = indexExpression(identifier('foo'), stringLiteral('bar'));

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: number literal`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      babelNumericLiteral(5),
      true
    );

    const expected = indexExpression(
      identifier('foo'),
      withTrailingConversionComment(
        numericLiteral(6),
        'ROBLOX adaptation: added 1 to array index'
      )
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: octal number literal`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      { ...babelNumericLiteral(12), extra: { raw: '0o14' } },
      true
    );

    const expected = indexExpression(
      identifier('foo'),
      withTrailingConversionComment(
        numericLiteral(13),
        'ROBLOX adaptation: added 1 to array index'
      )
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: boolean literal`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      babelBooleanLiteral(true),
      true
    );

    const expected = indexExpression(
      identifier('foo'),
      callExpression(identifier('tostring'), [booleanLiteral(true)])
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: expression`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      babelIdentifier('bar'),
      true
    );

    const expected = indexExpression(
      identifier('foo'),
      callExpression(identifier('tostring'), [identifier('bar')])
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: binary expression, adding string literal`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      babelBinaryExpression(
        '+',
        babelStringLiteral('bar'),
        babelIdentifier('baz')
      ),
      true
    );

    const expected = indexExpression(
      identifier('foo'),
      binaryExpression(
        stringLiteral('bar'),
        '..',
        callExpression(identifier('tostring'), [identifier('baz')])
      )
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle computed index expression: binary expression, adding NOT string literals`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      babelBinaryExpression(
        '+',
        babelIdentifier('bar'),
        babelIdentifier('baz')
      ),
      true
    );

    const expected = indexExpression(
      identifier('foo'),
      callExpression(identifier('tostring'), [
        binaryExpression(identifier('bar'), '+', identifier('baz')),
      ])
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should convert handle not computed member expression`, () => {
    const given = babelMemberExpression(
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const expected = memberExpression(
      identifier('foo'),
      '.',
      identifier('bar')
    );

    expect(handleMemberExpression.handler(source, {}, given)).toEqual(expected);
  });

  it.each(['string', 'error', 'table', 'ipairs'])(
    `should convert handle not computed member expression with lua global as key`,
    (idName) => {
      const given = babelMemberExpression(
        babelIdentifier('foo'),
        babelIdentifier(idName)
      );

      const expected = memberExpression(
        identifier('foo'),
        '.',
        identifier(idName)
      );

      expect(handleMemberExpression.handler(source, {}, given)).toEqual(
        expected
      );
    }
  );

  it.each(['repeat', 'until', 'not', 'end'])(
    `should convert handle not computed member expression with lua reserved keyword as key`,
    (idName) => {
      const given = babelMemberExpression(
        babelIdentifier('foo'),
        babelIdentifier(idName)
      );

      const expected = indexExpression(
        identifier('foo'),
        stringLiteral(idName)
      );

      expect(handleMemberExpression.handler(source, {}, given)).toEqual(
        expected
      );
    }
  );

  describe('unhandled cases', () => {
    it('should NOT YET handle expression with private name as key', () => {
      const given = babelMemberExpression(
        babelIdentifier('foo'),
        privateName(babelIdentifier('bar'))
      );

      const expected = indexExpression(
        identifier('foo'),
        withTrailingConversionComment(
          unhandledExpression(),
          'ROBLOX TODO: Unhandled node for type: PrivateName'
        )
      );

      expect(handleMemberExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should NOT YET handle expression with private name as key', () => {
      const given = {
        ...babelMemberExpression(
          babelIdentifier('foo'),
          privateName(babelIdentifier('bar'))
        ),
        // babelMemberExpression doesn't allow PrivateName and computed combination
        computed: true,
      };

      const expected = indexExpression(
        identifier('foo'),
        withTrailingConversionComment(
          unhandledExpression(),
          'ROBLOX TODO: Unhandled node for type: PrivateName'
        )
      );

      expect(handleMemberExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });
});
