import { testUtils } from '@js-to-lua/handler-utils';
import {
  binaryExpression,
  callExpression,
  identifier,
  multilineStringLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { joinExpressionsWith } from './join-expressions-with';

const { withLuaComments } = testUtils;

describe('Join Expressions With', () => {
  const joinExpressionsWithSeparator = joinExpressionsWith('[separator]');

  describe('without comment', () => {
    it('should join 2 string literals', () => {
      const [leftGiven, rightGiven] = [
        stringLiteral('foo'),
        stringLiteral('bar'),
      ];
      const expected = stringLiteral('foo[separator]bar');
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join 2 multiline string literals', () => {
      const [leftGiven, rightGiven] = [
        multilineStringLiteral('foo'),
        multilineStringLiteral('bar'),
      ];
      const expected = multilineStringLiteral('foo[separator]bar');
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join 2 multiline string literals with leading new lines', () => {
      const [leftGiven, rightGiven] = [
        multilineStringLiteral('\n\nfoo'),
        multilineStringLiteral('\n\nbar'),
      ];
      const expected = multilineStringLiteral('\n\nfoo[separator]\nbar');
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join string literal with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        stringLiteral('foo'),
        multilineStringLiteral('bar'),
      ];
      const expected = binaryExpression(
        stringLiteral('foo[separator]'),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join multiline string literal with string literal', () => {
      const [leftGiven, rightGiven] = [
        multilineStringLiteral('foo'),
        stringLiteral('bar'),
      ];
      const expected = binaryExpression(
        multilineStringLiteral('foo[separator]'),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with string literal on the right) with string literal', () => {
      const [leftGiven, rightGiven] = [
        binaryExpression(identifier('id'), '..', stringLiteral('foo')),
        stringLiteral('bar'),
      ];
      const expected = binaryExpression(
        identifier('id'),
        '..',
        stringLiteral('foo[separator]bar')
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with multiline string literal on the right) with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        binaryExpression(identifier('id'), '..', multilineStringLiteral('foo')),
        multilineStringLiteral('bar'),
      ];
      const expected = binaryExpression(
        identifier('id'),
        '..',
        multilineStringLiteral('foo[separator]bar')
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with multiline string literal on the right) with string literal', () => {
      const [leftGiven, rightGiven] = [
        binaryExpression(identifier('id'), '..', multilineStringLiteral('foo')),
        stringLiteral('bar'),
      ];
      const expected = binaryExpression(
        binaryExpression(
          identifier('id'),
          '..',
          multilineStringLiteral('foo[separator]')
        ),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with string literal on the right) with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        binaryExpression(identifier('id'), '..', stringLiteral('foo')),
        multilineStringLiteral('bar'),
      ];
      const expected = binaryExpression(
        binaryExpression(
          identifier('id'),
          '..',
          stringLiteral('foo[separator]')
        ),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join other expression with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        callExpression(identifier('id')),
        multilineStringLiteral('bar'),
      ];
      const expected = binaryExpression(
        leftGiven,
        '..',
        multilineStringLiteral('[separator]bar')
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join other expression with string literal', () => {
      const [leftGiven, rightGiven] = [
        callExpression(identifier('id')),
        stringLiteral('bar'),
      ];
      const expected = binaryExpression(
        leftGiven,
        '..',
        stringLiteral('[separator]bar')
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join 2 other expressions', () => {
      const [leftGiven, rightGiven] = [
        callExpression(identifier('id')),
        callExpression(identifier('bar')),
      ];
      const expected = binaryExpression(
        binaryExpression(leftGiven, '..', stringLiteral('[separator]')),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });
  });

  describe('with comment', () => {
    it('should join 2 string literals', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(stringLiteral('foo'), 'comment 1'),
        withLuaComments(stringLiteral('bar'), 'comment 2'),
      ];
      const expected = withLuaComments(
        withLuaComments(stringLiteral('foo[separator]bar'), 'comment 1'),
        'comment 2'
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join 2 multiline string literals', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(multilineStringLiteral('foo'), 'comment 1'),
        withLuaComments(multilineStringLiteral('bar'), 'comment 2'),
      ];
      const expected = withLuaComments(
        withLuaComments(
          multilineStringLiteral('foo[separator]bar'),
          'comment 1'
        ),
        'comment 2'
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join 2 multiline string literals with leading new lines', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(multilineStringLiteral('\n\nfoo'), 'comment 1'),
        withLuaComments(multilineStringLiteral('\n\nbar'), 'comment 2'),
      ];
      const expected = withLuaComments(
        withLuaComments(
          multilineStringLiteral('\n\nfoo[separator]\nbar'),
          'comment 1'
        ),
        'comment 2'
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join string literal with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(stringLiteral('foo'), 'comment 1'),
        withLuaComments(multilineStringLiteral('bar'), 'comment 2'),
      ];
      const expected = binaryExpression(
        withLuaComments(stringLiteral('foo[separator]'), 'comment 1'),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join multiline string literal with string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(multilineStringLiteral('foo'), 'comment 1'),
        withLuaComments(stringLiteral('bar'), 'comment 2'),
      ];
      const expected = binaryExpression(
        withLuaComments(multilineStringLiteral('foo[separator]'), 'comment 1'),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with string literal on the right) with string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(
          binaryExpression(
            withLuaComments(identifier('id'), 'comment 2'),
            '..',
            withLuaComments(stringLiteral('foo'), 'comment 3')
          ),
          'comment 1'
        ),
        withLuaComments(stringLiteral('bar'), 'comment 4'),
      ];
      const expected = withLuaComments(
        binaryExpression(
          withLuaComments(identifier('id'), 'comment 2'),
          '..',
          withLuaComments(
            withLuaComments(stringLiteral('foo[separator]bar'), 'comment 3'),
            'comment 4'
          )
        ),
        'comment 1'
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with multiline string literal on the right) with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(
          binaryExpression(
            withLuaComments(identifier('id'), 'comment 2'),
            '..',
            withLuaComments(multilineStringLiteral('foo'), 'comment 3')
          ),
          'comment 1'
        ),
        withLuaComments(multilineStringLiteral('bar'), 'comment 4'),
      ];
      const expected = withLuaComments(
        binaryExpression(
          withLuaComments(identifier('id'), 'comment 2'),
          '..',
          withLuaComments(
            withLuaComments(
              multilineStringLiteral('foo[separator]bar'),
              'comment 3'
            ),
            'comment 4'
          )
        ),
        'comment 1'
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with multiline string literal on the right) with string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(
          binaryExpression(
            withLuaComments(identifier('id'), 'comment 2'),
            '..',
            withLuaComments(multilineStringLiteral('foo'), 'comment 3')
          ),
          'comment 1'
        ),
        withLuaComments(stringLiteral('bar'), 'comment 4'),
      ];
      const expected = binaryExpression(
        withLuaComments(
          binaryExpression(
            withLuaComments(identifier('id'), 'comment 2'),
            '..',
            withLuaComments(
              multilineStringLiteral('foo[separator]'),
              'comment 3'
            )
          ),
          'comment 1'
        ),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join binary expression (with string literal on the right) with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(
          binaryExpression(
            withLuaComments(identifier('id'), 'comment 2'),
            '..',
            withLuaComments(stringLiteral('foo'), 'comment 3')
          ),
          'comment 1'
        ),
        withLuaComments(multilineStringLiteral('bar'), 'comment 4'),
      ];
      const expected = binaryExpression(
        withLuaComments(
          binaryExpression(
            withLuaComments(identifier('id'), 'comment 2'),
            '..',
            withLuaComments(stringLiteral('foo[separator]'), 'comment 3')
          ),
          'comment 1'
        ),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join other expression with multiline string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(callExpression(identifier('id')), 'comment 1'),
        withLuaComments(multilineStringLiteral('bar'), 'comment 2'),
      ];
      const expected = binaryExpression(
        leftGiven,
        '..',
        withLuaComments(multilineStringLiteral('[separator]bar'), 'comment 2')
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join other expression with string literal', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(callExpression(identifier('id')), 'comment 1'),
        withLuaComments(stringLiteral('bar'), 'comment 2'),
      ];
      const expected = binaryExpression(
        leftGiven,
        '..',
        withLuaComments(stringLiteral('[separator]bar'), 'comment 2')
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });

    it('should join 2 other expressions', () => {
      const [leftGiven, rightGiven] = [
        withLuaComments(callExpression(identifier('id')), 'comment 1'),
        withLuaComments(callExpression(identifier('bar')), 'comment 2'),
      ];
      const expected = binaryExpression(
        binaryExpression(leftGiven, '..', stringLiteral('[separator]')),
        '..',
        rightGiven
      );
      const actual = joinExpressionsWithSeparator(leftGiven, rightGiven);

      expect(actual).toEqual(expected);
    });
  });
});
